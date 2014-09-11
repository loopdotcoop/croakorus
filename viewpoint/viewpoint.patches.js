//// From .build/browser/packages/x3dom.js:19251
//// Prevent right-button drag to zoom, and alt-drag to zoom

if (Meteor.isClient) {

    x3dom.Viewarea.prototype.onDrag = function (x, y, buttonState)
    {
        // should onmouseover/-out be handled on drag?
        this.handleMoveEvt(x, y, buttonState);


        var navi = this._scene.getNavigationInfo();
        var navType = navi.getType();


        if (navType === "none") {
            return;
        }


        var viewpoint = this._scene.getViewpoint();


        var dx = x - this._lastX;
        var dy = y - this._lastY;
        var d, vec, mat = null;
        var alpha, beta;


        if (navType === "examine")
        {
            if (buttonState & 1) //left
            {
                alpha = (dy * 2 * Math.PI) / this._width;
                beta = (dx * 2 * Math.PI) / this._height;
                mat = this.getViewMatrix();


                var mx = x3dom.fields.SFMatrix4f.rotationX(alpha);
                var my = x3dom.fields.SFMatrix4f.rotationY(beta);


                var center = viewpoint.getCenterOfRotation();
                mat.setTranslate(new x3dom.fields.SFVec3f(0,0,0));


                this._rotMat = this._rotMat.
                               mult(x3dom.fields.SFMatrix4f.translation(center)).
                               mult(mat.inverse()).mult(mx).mult(my).mult(mat).
                               mult(x3dom.fields.SFMatrix4f.translation(center.negate()));
            }
            if (buttonState & 4) //middle
            {
                d = (this._scene._lastMax.subtract(this._scene._lastMin)).length();
                d = ((d < x3dom.fields.Eps) ? 1 : d) * navi._vf.speed;


                vec = new x3dom.fields.SFVec3f(d*dx/this._width, d*(-dy)/this._height, 0);
                this._movement = this._movement.add(vec);


                mat = this.getViewpointMatrix().mult(this._transMat);
                //TODO; move real distance along viewing plane
                this._transMat = mat.inverse().
                                 mult(x3dom.fields.SFMatrix4f.translation(this._movement)).
                                 mult(mat);
            }
            if (buttonState & 2) //right
            {
                d = (this._scene._lastMax.subtract(this._scene._lastMin)).length();
                d = ((d < x3dom.fields.Eps) ? 1 : d) * navi._vf.speed;


                vec = new x3dom.fields.SFVec3f(0, 0, d*(dx+dy)/this._height);
                this._movement = this._movement.add(vec);


                mat = this.getViewpointMatrix().mult(this._transMat);
                //TODO; move real distance along viewing ray
                this._transMat = mat.inverse().
                                 mult(x3dom.fields.SFMatrix4f.translation(this._movement)).
                                 mult(mat);
            }


            this._isMoving = true;
        }
        else if (navType === "turntable")   // requires that y is up vector in world coords
        {
            if (buttonState & 1) //left
            {
                alpha = (dy * 2 * Math.PI) / this._height;
                beta = (dx * 2 * Math.PI) / this._width;


                this._up = this._flyMat.e1();
                this._from = this._flyMat.e3();


                var offset = this._from.subtract(this._at);


                // angle in xz-plane
                var phi = Math.atan2(offset.x, offset.z);


                // angle from y-axis
                var theta = Math.atan2(Math.sqrt(offset.x * offset.x + offset.z * offset.z), offset.y);


                phi -= Math.min(beta, 0.1);
                theta -= Math.min(alpha, 0.1);


                // clamp theta
                var typeParams = navi.getTypeParams();
                theta = Math.max(typeParams[2], Math.min(typeParams[3], theta));


                var radius = offset.length();


                // calc new cam position
                var rSinPhi = radius * Math.sin(theta);


                offset.x = rSinPhi * Math.sin(phi);
                offset.y = radius  * Math.cos(theta);
                offset.z = rSinPhi * Math.cos(phi);


                offset = this._at.add(offset);


                // calc new up vector
                theta -= Math.PI / 2;


                var sinPhi = Math.sin(theta);
                var cosPhi = Math.cos(theta);
                var up = new x3dom.fields.SFVec3f(sinPhi * Math.sin(phi), cosPhi, sinPhi * Math.cos(phi));


                if (up.y < 0)
                    up = up.negate();


                this._flyMat = x3dom.fields.SFMatrix4f.lookAt(offset, this._at, up);
                viewpoint.setView(this._flyMat.inverse());


                //// Update the `viewpointRotation` session variable as the user looks around.
                if (0 < up.x && 0 < up.z) { // x and z are both positive
                    if (up.x < up.z) { // x is smaller than z
                        Session.set('viewpointRotation', 'south'); // south-southeast
                    } else { // z is smaller than x
                        Session.set('viewpointRotation', 'east'); // east-southeast
                    }
                } else if (0 < up.x) { // x is positive, z is negative
                    if (-up.x < up.z) { // x is smaller than z
                        Session.set('viewpointRotation', 'east'); // east-northeast
                    } else { // z is smaller than x
                        Session.set('viewpointRotation', 'north'); // north-northeast
                    }
                } else if (0 < up.z) { // x is negative, z is positive
                    if (-up.x < up.z) { // x is smaller than z
                        Session.set('viewpointRotation', 'south'); // south-southwest
                    } else { // z is smaller than x
                        Session.set('viewpointRotation', 'west'); // west-southwest
                    }
                } else { // x and z are both negative
                    if (up.x < up.z) { // x is smaller than z
                        Session.set('viewpointRotation', 'west'); // west-northwest
                    } else { // z is smaller than x
                        Session.set('viewpointRotation', 'north'); // north-northwest
                    }
                }

            }
            else if (buttonState & 2) //right
            {
                // d = (this._scene._lastMax.subtract(this._scene._lastMin)).length();
                // d = ((d < x3dom.fields.Eps) ? 1 : d) * navi._vf.speed;


                // this._up = this._flyMat.e1();
                // this._from = this._flyMat.e3();


                // // zoom in/out
                // var dir = this._from.subtract(this._at).normalize();
                // this._from = this._from.addScaled(dir, -d*(dx+dy) / this._height);


                // this._flyMat = x3dom.fields.SFMatrix4f.lookAt(this._from, this._at, this._up);
                // viewpoint.setView(this._flyMat.inverse());
            }


            this._isMoving = true;
        }


        this._dx = dx;
        this._dy = dy;


        this._lastX = x;
        this._lastY = y;
    };

}


/* @todo delete these research notes


south                     
                          
x:0.0011430677568517547   0
y:0.9805806756909201      1
z:0.196112803910509       0.2
                          
east                      
                          
x:0.19611280391050878     0.2
y:0.9805806756909202      1
z:0.001143067756852375    0
                          
north                     
                          
x:0.0011430677568518136   0
y:0.9805806756909202      1
z:-0.19611280391050878    -0.2
                          
west                      
                          
x:-0.196112803910509      -0.2
y:0.9805806756909201      1
z:-0.0011430677568518342  0



south                     
x:-0.0011430677568518     0
y:0.9805806756909202      1
z:0.19611280391050856     0.2

0.005828623802520125


south-south-east
x:0.071481153005076       0.07
y:0.9746946177378969      1
z:0.21180379344534878     0.21

0.21296272148594889


south-east
x:0.15941255915436117     0.16
y:0.9606272210963793      1
z:0.22755873543440414     0.23

0.3713217679301287


south-east-east
x:0.23576386542825756     0.24
y:0.96062722109638        1
z:0.14700592453018094     0.15

1.0265785922446375


east                      
x:0.19611280391050878     0.2
y:0.9805806756909202      1
z:0.001143067756852375    0

*/






