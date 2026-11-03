import { Mat4 } from "./math/mat4.js";
import { Vec4 } from "./math/vec4.js";
import { Point2 } from "./math/point2.js";
import { Size2 } from "./math/size2.js"
import {Vec3} from "./math/vec3.js";
import {Point3} from "./math/point3.js";
import {Color} from "./math/color.js";

export function randomColor() {
    return new Color(Math.random() * 255, Math.random() * 255, Math.random() * 255, 255);
}

export function degreesToRadians(degrees) {
    return degrees / 180 * Math.PI;
}

export function discriminant(a, b, c) {
    return b * b - 4 * a * c;
}

export function getViewportSizeFromCamera(camera) {
    return new Size2(
        2 * camera.focalLength * Math.tan(degreesToRadians(camera.fieldOfView) / 2),
        2 * camera.focalLength * Math.tan(degreesToRadians(camera.fieldOfView) / 2)
    );
}

function canvasToViewport(canvasPoint, canvasSize, viewportSize) {
    return new Point2(
        canvasPoint.x * (viewportSize.width / canvasSize.width),
        canvasPoint.y * (viewportSize.height / canvasSize.height)
    );
}

function viewportToCamera(viewportPoint, viewportSize, camera) {
    return new Point3(
        viewportPoint.x - viewportSize.width / 2,
        -viewportPoint.y + viewportSize.height / 2,
        camera.focalLength
    );
}

function cameraToWorld(cameraPoint, camera) {
    return camera.transform.times(cameraPoint);
}

function canvasSpaceToWorldSpace(canvasPoint, canvasSize, viewportSize, camera) {
    const viewportPoint = canvasToViewport(canvasPoint, canvasSize, viewportSize);
    const cameraPoint = viewportToCamera(viewportPoint, viewportSize, camera);
    return cameraToWorld(cameraPoint, camera);
}

function canvasPixelCenter(canvasPoint) {
    return new Point2(
        canvasPoint.x + 0.5,
        canvasPoint.y + 0.5
    );
}

function randomLocationInsideCanvasPixel(canvasPoint) {
    return new Point2(
        canvasPoint.x + Math.random(),
        canvasPoint.y + Math.random()
    );
}

function canvasPixelCenterToWorldSpace(canvasPoint, canvasSize, viewportSize, camera) {
    return canvasSpaceToWorldSpace(canvasPixelCenter(canvasPoint), canvasSize, viewportSize, camera);
}

export function randomLocationInsideCanvasPixelToWorldSpace(canvasPoint, canvasSize, viewportSize, camera) {
    return canvasSpaceToWorldSpace(randomLocationInsideCanvasPixel(canvasPoint), canvasSize, viewportSize, camera);
}

function shootRayAtObjects(ray, objects) {
    let min_t = Infinity;
    let closest_hit_record = null;

    for (const object of objects) {
        const hit_record = object.hit_test(ray);

        if (hit_record && hit_record.t < min_t && hit_record.t >= 0.001) {
            min_t = hit_record.t;
            closest_hit_record = hit_record;
            closest_hit_record.object = object;
        }
    }

    if (closest_hit_record) {
        closest_hit_record.point = ray.at(closest_hit_record.t);
    }

    return closest_hit_record;
}

function surfaceNormalToColor(surfaceNormal) {
    return surfaceNormal.toUnit().plus(1).dividedBy(2).times(255);
}

// we need to make this function recursive and follow the ray to where it bounces
export function getColorAtRayHitPoint(ray, scene, maxBounces, bounce) {

    if (bounce === maxBounces) {
        return new Color(0, 0, 0, 255);
    }

    const hit_record = shootRayAtObjects(ray, scene);

    if (hit_record) {
        const surfaceNormal = hit_record.object.surface_normal(hit_record).toUnit();

        // return surfaceNormalToColor(surfaceNormal);

        const surfaceAlbedo = hit_record.object.material.albedo;
        const bounceRay = hit_record.object.material.scatter(ray, hit_record.point, surfaceNormal);
        const bounceColor = getColorAtRayHitPoint(bounceRay, scene, maxBounces, bounce + 1);

        return surfaceAlbedo.times(bounceColor);
    } else {
        // this is the background color
        return new Color(255 * 0.7, 255 * 0.8, 255, 255);
    }
}











