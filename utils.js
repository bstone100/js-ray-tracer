export function randomColor() {
    return {
        r: Math.random() * 255,
        g: Math.random() * 255,
        b: Math.random() * 255
    };
}

function dot(vec1, vec2) {
    return (vec1.x * vec2.x) + (vec1.y * vec2.y) + (vec1.z * vec2.z);
}

function sub(vec1, vec2) {
    return {
        x: vec1.x - vec2.x,
        y: vec1.y - vec2.y,
        z: vec1.z - vec2.z
    };
}

function add(vec1, vec2) {
    return {
        x: vec1.x + vec2.x,
        y: vec1.y + vec2.y,
        z: vec1.z + vec2.z
    };
}

function scale(scalar, vec) {
    return {
        x: scalar * vec.x,
        y: scalar * vec.y,
        z: scalar * vec.z
    };
}

function vecLength(vec) {
    return Math.sqrt(Math.pow(vec.x, 2) + Math.pow(vec.y, 2) + Math.pow(vec.z, 2));
}

function unit(vec) {
    return scale(1 / vecLength(vec), vec);
}

function writeCanvasPixel(x, y, color, canvasBuffer, canvasWidth) {
    const offset = 4 * (canvasWidth * y + x);
    canvasBuffer.data[offset] = color.r;
    canvasBuffer.data[offset + 1] = color.g;
    canvasBuffer.data[offset + 2] = color.b;
    canvasBuffer.data[offset + 3] = color.a;
}

function updateCanvas(canvasContext, canvasBuffer) {
    canvasContext.putImageData(canvasBuffer, 0, 0);
}

function degreesToRadians(degrees) {
    return degrees / 180 * Math.PI;
}

function dotVecArrays(vec1, vec2) {
    let ret = 0;
    for (let i = 0; i < vec1.length; i++) {
        ret += vec1[i] * vec2[i];
    }
    return ret;
}

function transformPoint(transform, point) {
    // transform is 4x4 matrix, point is object with x, y, z
    // we'll return a point in the same form as the param

    const vec = [point.x, point.y, point.z, 1];

    return {
        x: dotVecArrays(transform[0], vec),
        y: dotVecArrays(transform[1], vec),
        z: dotVecArrays(transform[2], vec)
    };
}

function transformVector(transform, vector) {
    // zero instead of one at the end so translation isn't applied
    const vec = [vector.x, vector.y, vector.z, 0];

    return {
        x: dotVecArrays(transform[0], vec),
        y: dotVecArrays(transform[1], vec),
        z: dotVecArrays(transform[2], vec)
    };
}

function invertTransform(transform) {
    // take a 4x4 matrix and invert it
    // for now we're going to assume there is only rotation and translation, no scale or shear
    // that means the transform matrix's basis vectors are orthonormal

    const X = [transform[0][0], transform[1][0], transform[2][0], transform[3][0]];
    const Y = [transform[0][1], transform[1][1], transform[2][1], transform[3][1]];
    const Z = [transform[0][2], transform[1][2], transform[2][2], transform[3][2]];
    const T = [transform[0][3], transform[1][3], transform[2][3], transform[3][3]];

    return [
        // x0, x1, x2, -T•X
        [X[0], X[1], X[2], -dotVecArrays(T, X)],
        [Y[0], Y[1], Y[2], -dotVecArrays(T, Y)],
        [Z[0], Z[1], Z[2], -dotVecArrays(T, Z)],
        [0, 0, 0, 1]
    ];
}


export function getViewportSizeFromCamera(camera) {
    return {
        width: 2 * camera.focalLength * Math.tan(degreesToRadians(camera.fieldOfView) / 2),
        height: 2 * camera.focalLength * Math.tan(degreesToRadians(camera.fieldOfView) / 2)
    };
}

function canvasSpace2DToViewportSpace2D(posCanvas, canvas, viewport) {
    return {
        x: posCanvas.x * (viewport.width / canvas.width),
        y: posCanvas.y * (viewport.height / canvas.height)
    };
}

function viewportSpace2DToCameraSpace3D(posViewport, viewport, camera) {
    return {
        x: posViewport.x - viewport.width / 2,
        y: -posViewport.y + viewport.height / 2,
        z: camera.focalLength
    };
}

function cameraSpace3DToWorldSpace3D(posCamera, camera) {
    return transformPoint(camera.transform, posCamera);
}

function canvasSpaceToWorldSpace(posCanvas, canvas, viewport, camera) {
    const posViewport = canvasSpace2DToViewportSpace2D(posCanvas, canvas, viewport);
    const posCamera = viewportSpace2DToCameraSpace3D(posViewport, viewport, camera);
    return cameraSpace3DToWorldSpace3D(posCamera, camera);
}

function canvasPixelCenter(posCanvas) {
    return {
        x: posCanvas.x + 0.5,
        y: posCanvas.y + 0.5
    }
}

function randomLocationInsideCanvasPixel(posCanvas) {
    return {
        x: posCanvas.x + Math.random(),
        y: posCanvas.y + Math.random()
    };
}

function canvasPixelCenterToWorldSpace(posCanvas, canvas, viewport, camera) {
    return canvasSpaceToWorldSpace(canvasPixelCenter(posCanvas), canvas, viewport, camera);
}

export function randomLocationInsideCanvasPixelToWorldSpace(posCanvas, canvas, viewport, camera) {
    return canvasSpaceToWorldSpace(randomLocationInsideCanvasPixel(posCanvas), canvas, viewport, camera);
}

// return a hit record object
function shootRayAtSphere(ray, sphere) {
    const a = dot(ray.direction, ray.direction);
    const b = -2 * dot(ray.direction, sub(sphere.center, ray.origin));
    const c = dot(sub(sphere.center, ray.origin), sub(sphere.center, ray.origin)) - Math.pow(sphere.radius, 2);

    const discriminant = Math.pow(b, 2) - 4 * a * c;

    if (discriminant >= 0) {
        const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
        const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);

        if (t1 < 0 && t2 < 0) return {};
        if (t1 >= 0 && t2 < 0) return {t: t1};
        if (t1 < 0 && t2 >= 0) return {t: t2};
        return {t: Math.min(t1, t2)};
    }
    return {};
}

// return a hit record object
function shootRayAtBox(ray, box) {
    // let's work through this
    // let's assume for now that the box has no rotation, so it is axis aligned
    // we're going to be finding between 2 and 6 t values
    // 6 t values is the normal case
    // 2 t values means the ray is parallel to 4 of the box planes (perpendicular to 2 of them)

    const boxMin = {
        x: box.center.x - box.width / 2,
        y: box.center.y - box.height / 2,
        z: box.center.z - box.depth / 2
    };

    const boxMax = {
        x: box.center.x + box.width / 2,
        y: box.center.y + box.height / 2,
        z: box.center.z + box.height / 2
    };

    // ray is P(t) = Q + td
    // P(t).x = Q.x + t*d.x
    // (P(t).x - Q.x) / d.x = t
    // P(t).x is boxMin.x and boxMax.x

    // the box forms two planes with a known x, X = boxMin.x and X = boxMax.x
    // we can solve for t on a ray, just by knowing a single x, y, or z value

    const slabs = [
        {
            plane: "left",
            t: (boxMin.x - ray.origin.x) / ray.direction.x
        },
        {
            plane: "right",
            t: (boxMax.x - ray.origin.x) / ray.direction.x
        },
        {
            plane: "bottom",
            t: (boxMin.y - ray.origin.y) / ray.direction.y
        },
        {
            plane: "top",
            t: (boxMax.y - ray.origin.y) / ray.direction.y
        },
        {
            plane: "backward",
            t: (boxMin.z - ray.origin.z) / ray.direction.z
        },
        {
            plane: "forward",
            t: (boxMax.z - ray.origin.z) / ray.direction.z
        }
    ];


    // a plane hit point is only actually a box hit point if x, y, and z all are within the box range
    // in most cases there should be two hit points, with one being closer to the ray origin

    // let's find the valid hit points

    let min_t = Infinity;
    let hit_record = {};

    for (const slab of slabs) {
        // t has to be greater than 0
        // point.x, point.y, point.z all have to be within interval formed by boxMin, boxMax

        if (slab.t >= 0 && slab.t < min_t) {
            const p = getPointOnRay(ray, slab.t);

            // let's not redundantly compare the coordinate we already know since the comparison could fail due to floating point error

            if (slab.plane === "left" || slab.plane === "right") {
                // just compare y and z
                if (p.y >= boxMin.y &&
                    p.y <= boxMax.y &&
                    p.z >= boxMin.z &&
                    p.z <= boxMax.z)
                {
                    min_t = slab.t;
                    hit_record = slab;
                    hit_record.point = p;
                }
            } else if (slab.plane === "top" || slab.plane === "bottom") {
                if (p.x >= boxMin.x &&
                    p.x <= boxMax.x &&
                    p.z >= boxMin.z &&
                    p.z <= boxMax.z)
                {
                    min_t = slab.t;
                    hit_record = slab;
                    hit_record.point = p;
                }
            } else if (slab.plane === "forward" || slab.plane === "backward") {
                if (p.x >= boxMin.x &&
                    p.x <= boxMax.x &&
                    p.y >= boxMin.y &&
                    p.y <= boxMax.y)
                {
                    min_t = slab.t;
                    hit_record = slab;
                    hit_record.point = p;
                }
            }
        }
    }

    return hit_record;
}

function shootRayAtCylinder(ray, cylinder) {
    // there are three components we need to test: the main side surface of the cylinder, and the top and bottom
    // all of this math is easier to do if we assume the cylinder is aligned with the Y axis
    // we can achieve this by just shifting the ray origin by the reverse of the cylinder's translation
    // the t values will be the same

    // let's start with the top and bottom of the cylinder as they're easier

    // top
    // find intersection of ray with entire upper plane where we know y = center y + height / 2


    // we are going to do the math in cylinder space
    // that means we assume the cylinder is centered at the origin and the ray has been transformed to cylinder space
    // so we need to apply the inverse of the cylinder's transform to the ray
    // apply to both the ray origin and direction, I think

    const inverseCylinderTransform = invertTransform(cylinder.transform);

    // this is incorrect
    // the ray origin should be applied the inverse transform
    // but the ray direction should only be applied the inverse rotation, not the translation

    const localRay = {
        origin: transformPoint(inverseCylinderTransform, ray.origin),
        direction: transformVector(inverseCylinderTransform, ray.direction)
    };

    // now let's update the following calculations given our new assumptions


    const upperPlaneT = (cylinder.height / 2 - localRay.origin.y) / localRay.direction.y; // local calculation

    // updating this to local as well because we need to verify that the point is in the circle
    // this point is no longer in world space, it's in cylinder local space now, so don't pass it into the hit record
    const upperPlanePoint = getPointOnRay(localRay, upperPlaneT);

    // check if point is within the top circle
    const upperPointValid = upperPlaneT >= 0 &&
        Math.pow(upperPlanePoint.x, 2) +
        Math.pow(upperPlanePoint.z, 2)
        <= Math.pow(cylinder.radius, 2);

    // now let's do the bottom surface

    const lowerPlaneT = (- cylinder.height / 2 - localRay.origin.y) / localRay.direction.y;
    const lowerPlanePoint = getPointOnRay(localRay, lowerPlaneT);

    const lowerPointValid = lowerPlaneT >= 0 &&
        Math.pow(lowerPlanePoint.x, 2) +
        Math.pow(lowerPlanePoint.z, 2)
        <= Math.pow(cylinder.radius, 2);

    // now time to do the main surface

    const a = Math.pow(localRay.direction.x, 2) + Math.pow(localRay.direction.z, 2);
    const b = 2 * (localRay.origin.x * localRay.direction.x + localRay.origin.z * localRay.direction.z);
    const c = Math.pow(localRay.origin.x, 2) + Math.pow(localRay.origin.z, 2) - Math.pow(cylinder.radius, 2);

    const discriminant = b * b - 4 * a * c;

    let mainSurfaceT1 = null;
    let mainSurfaceT2 = null;

    if (discriminant >= 0) {
        mainSurfaceT1 = (-b - Math.sqrt(discriminant)) / (2 * a);
        mainSurfaceT2 = (-b + Math.sqrt(discriminant)) / (2 * a);
    }

    // now we need to find out if these two intersection points are within the Y range

    let mainPoint1Valid = false;
    let mainPoint2Valid = false;

    let mainPoint1 = null;
    let mainPoint2 = null;

    if (mainSurfaceT1) {
        mainPoint1 = getPointOnRay(localRay, mainSurfaceT1);
        mainPoint1Valid = mainSurfaceT1 >= 0 &&
                          mainPoint1.y >= - cylinder.height / 2 &&
                          mainPoint1.y <= cylinder.height / 2;
    }

    if (mainSurfaceT2) {
        mainPoint2 = getPointOnRay(localRay, mainSurfaceT2);
        mainPoint2Valid = mainSurfaceT2 >= 0 &&
                          mainPoint2.y >= - cylinder.height / 2 &&
                          mainPoint2.y <= cylinder.height / 2;
    }

    // now we have up to 4 t values, and we know if each is valid or not, we need the smallest one

    // don't return these points in the hit record, they aren't useful anymore for the caller function since they are in local space

    const options = [
        {
            surface: "top",
            t: upperPlaneT,
            valid: upperPointValid
        },
        {
            surface: "bottom",
            t: lowerPlaneT,
            valid: lowerPointValid
        },
        {
            surface: "main",
            t: mainSurfaceT1,
            valid: mainPoint1Valid
        },
        {
            surface: "main",
            t: mainSurfaceT2,
            valid: mainPoint2Valid
        }
    ];

    let min_t = Infinity;
    let hit_record = {};


    for (const option of options) {
        if (option.valid && option.t < min_t) {
            min_t = option.t;
            hit_record = option;
        }
    }

    return hit_record;
}

function shootRayAtCone(ray, cone) {
    // a cone has two surfaces, the bottom and the main surface

    // let's do the main surface first, it's another quadratic but even more confusing this time since the radius of the cone varies by your vertical position on the cone

    // the following assumes the center of the cone is in the middle of the cone, and that this center is at the world origin

    // once we add the ability to rotate a cone, I think we're going to need to apply the inverse cone transform to both the ray origin and ray direction

    // okay yeah now we can rotate a cone so let's get the ray in cone space

    const inverseConeMatrix = invertTransform(cone.transform);

    const localRay = {
        origin: transformPoint(inverseConeMatrix, ray.origin),
        direction: transformPoint(inverseConeMatrix, ray.direction)
    };

    // these constants are just for convenience
    const k1 = Math.pow(cone.radius, 2) / Math.pow(cone.height, 2);
    const k2 = cone.height - localRay.origin.y - cone.height / 2;

    const a = Math.pow(localRay.direction.x, 2) + Math.pow(localRay.direction.z, 2) - Math.pow(localRay.direction.y, 2) * k1;
    const b = 2 * (localRay.origin.x * localRay.direction.x + localRay.origin.z * localRay.direction.z + localRay.direction.y * k2 * k1);
    const c = Math.pow(localRay.origin.x, 2) + Math.pow(localRay.origin.z, 2) - k1 * Math.pow(k2, 2);

    const discriminant = b * b - 4 * a * c;

    let mainT1 = null;
    let mainT2 = null;

    let mainPoint1 = null;
    let mainPoint2 = null;

    let main1Valid = false;
    let main2Valid = false;

    if (discriminant >= 0) {
        mainT1 = (-b - Math.sqrt(discriminant)) / (2 * a);
        mainT2 = (-b + Math.sqrt(discriminant)) / (2 * a);

        // points in cone space
        mainPoint1 = getPointOnRay(localRay, mainT1);
        mainPoint2 = getPointOnRay(localRay, mainT2);

        // check that y is within range
        main1Valid = mainT1 >= 0 &&
                     mainPoint1.y >= - cone.height / 2 &&
                     mainPoint1.y <= cone.height / 2;

        main2Valid = mainT2 >= 0 &&
                     mainPoint2.y >= - cone.height / 2 &&
                     mainPoint2.y <= cone.height / 2;
    }

    // now it's time to check the bottom surface of the cone
    // we're going to find t for the full bottom plane, y = cone.center - cone.height / 2

    const bottomT = (- cone.height / 2 - localRay.origin.y) / localRay.direction.y;
    const bottomPoint = getPointOnRay(localRay, bottomT);

    const bottomValid = bottomT >= 0 &&
                        Math.pow(bottomPoint.x, 2) +
                        Math.pow(bottomPoint.z, 2)
                        <= Math.pow(cone.radius, 2);

    // don't put the local points in the hit record
    const options = [
        {
            surface: "main",
            t: mainT1,
            valid: main1Valid
        },
        {
            surface: "main",
            t: mainT2,
            valid: main2Valid
        },
        {
            surface: "bottom",
            t: bottomT,
            valid: bottomValid
        }
    ];

    let min_t = Infinity;
    let hit_record = {};

    for (const option of options) {
        if (option.valid && option.t < min_t) {
            min_t = option.t;
            hit_record = option;
        }
    }

    return hit_record;
}

function shootRayAtObject(ray, object) {
    switch (object.type) {
        case "sphere": return shootRayAtSphere(ray, object);
        case "box": return shootRayAtBox(ray, object);
        case "cylinder": return shootRayAtCylinder(ray, object);
        case "cone": return shootRayAtCone(ray, object);
        default: return {};
    }
}

function shootRayAtObjects(ray, objects) {
    let min_t = Infinity;
    let closest_hit_record = {};

    for (const object of objects) {
        const hit_record = shootRayAtObject(ray, object);

        if (hit_record.t && hit_record.t < min_t && hit_record.t >= 0.001) {
            min_t = hit_record.t;
            closest_hit_record = hit_record;
            closest_hit_record.object = object;
        }
    }

    if (closest_hit_record.object && !closest_hit_record.point) {
        closest_hit_record.point = getPointOnRay(ray, closest_hit_record.t);
    }

    return closest_hit_record;
}

function getPointOnRay(ray, t) {
    return add(ray.origin, scale(t, ray.direction));
}

function getSurfaceNormalAtPointOnSphere(sphere, point) {
    return unit(sub(point, sphere.center));
}

// we only need to know the side of the box to determine the surface normal
function getSurfaceNormalAtPointOnBox(plane) {
    switch (plane) {
        case "left": return {x: -1, y: 0, z: 0};
        case "right": return {x: 1, y: 0, z: 0};
        case "bottom": return {x: 0, y: -1, z: 0};
        case "top": return {x: 0, y: 1, z: 0};
        case "backward": return {x: 0, y: 0, z: -1};
        case "forward": return {x: 0, y: 0, z: 1};
    }
}


function getLocalSurfaceNormalAtLocalPointOnCylinder(cylinder, point, surface) {
    switch (surface) {
        case "top": return {x: 0, y: 1, z: 0};
        case "bottom": return {x: 0, y: -1, z: 0};
        case "main": return {x: point.x, y: 0, z: point.z};
    }
}

function getWorldSurfaceNormalAtWorldPointOnCylinder(cylinder, point, surface) {
    const localPoint = transformPoint(invertTransform(cylinder.transform), point);
    const localSurfaceNormal = getLocalSurfaceNormalAtLocalPointOnCylinder(cylinder, localPoint, surface);
    return transformPoint(cylinder.transform, localSurfaceNormal);
}

function getLocalSurfaceNormalAtLocalPointOnCone(cone, point, surface) {
    switch (surface) {
        case "bottom": return {x: 0, y: -1, z: 0};
        case "main": {
            // the following algorithm was derived by putting the equation for points on the main surface into the form F(x, y, z) = 0
            // then finding the gradient vector by taking the partial derivatives of the equation
            // the gradient vector is itself the surface normal

            return {
                x: point.x,
                y: Math.pow(cone.radius, 2) / Math.pow(cone.height, 2) * (cone.height - point.y - cone.height / 2),
                z: point.z
            };
        }
    }
}

function getWorldSurfaceNormalAtWorldPointOnCone(cone, point, surface) {
    const localPoint = transformPoint(invertTransform(cone.transform), point);
    const localSurfaceNormal = getLocalSurfaceNormalAtLocalPointOnCone(cone, localPoint, surface);
    return transformPoint(cone.transform, localSurfaceNormal);
}

function getSurfaceNormalAtPointOnObject(hit_record) {
    switch (hit_record.object.type) {
        case "sphere": return getSurfaceNormalAtPointOnSphere(hit_record.object, hit_record.point);
        case "box": return getSurfaceNormalAtPointOnBox(hit_record.plane);
        case "cylinder": return getWorldSurfaceNormalAtWorldPointOnCylinder(hit_record.object, hit_record.point, hit_record.surface);
        case "cone": return getWorldSurfaceNormalAtWorldPointOnCone(hit_record.object, hit_record.point, hit_record.surface);
        default: return null;
    }
}

function getUnitSurfaceNormalAtPointOnObject(hit_record) {
    return unit(getSurfaceNormalAtPointOnObject(hit_record));
}

function makeRandomUnitVector() {
    return unit({
        x: Math.random() - 0.5,
        y: Math.random() - 0.5,
        z: Math.random() - 0.5
    });
}

function flipVector(vec) {
    return {
        x: -vec.x,
        y: -vec.y,
        z: -vec.z
    };
}

function makeBounceRayForDiffuseSurfaceHit(surfaceNormal, hitPoint) {
    let bounceDirection = makeRandomUnitVector();

    return {
        origin: hitPoint,
        direction: unit(add(surfaceNormal, bounceDirection))
    };
}

function makeBounceRayForMetalSurfaceHit(surfaceNormal, hitPoint, incomingRay) {
    // this is a mirror reflection
    // R = v - 2(v • N)N, where v is incomingRay.direction, N is surfaceNormal

    const bounceDirection = sub(incomingRay.direction, scale(2 * dot(incomingRay.direction, surfaceNormal), surfaceNormal));

    return {
        origin: hitPoint,
        direction: unit(bounceDirection)
    };
}

function makeBounceRayForSurfaceHit(surfaceNormal, hitPoint, incomingRay, material) {
    switch (material) {
        case "diffuse": return makeBounceRayForDiffuseSurfaceHit(surfaceNormal, hitPoint);
        case "metal": return makeBounceRayForMetalSurfaceHit(surfaceNormal, hitPoint, incomingRay);
    }
}

function surfaceNormalToColor(surfaceNormal) {
    const normalized = unit(surfaceNormal);

    return {
        r: (normalized.x + 1) / 2 * 255,
        g: (normalized.y + 1) / 2 * 255,
        b: (normalized.z + 1) / 2 * 255,
        a: 255
    };
}

// we need to make this function recursive and follow the ray to where it bounces
export function getColorAtRayHitPoint(ray, scene, maxBounces, bounce) {

    if (bounce === maxBounces) {
        return {
            r: 0,
            g: 0,
            b: 0,
            a: 255
        };
    }

    const hit_record = shootRayAtObjects(ray, scene);

    if (hit_record.object) {

        const surfaceNormal = getUnitSurfaceNormalAtPointOnObject(hit_record);

        // return surfaceNormalToColor(surfaceNormal);

        const objectColor = hit_record.object.color;
        const bounceRay = makeBounceRayForSurfaceHit(surfaceNormal, hit_record.point, ray, hit_record.object.material);
        const bounceColor = getColorAtRayHitPoint(bounceRay, scene, maxBounces, bounce + 1);

        return {
            r: objectColor.r / 255 * bounceColor.r,
            g: objectColor.g / 255 * bounceColor.g,
            b: objectColor.b / 255 * bounceColor.b,
            a: 255
        };
    } else {
        // this is the background color
        return {
            r: 255 * 0.7,
            g: 255 * 0.8,
            b: 255,
            a: 255
        };
    }
}