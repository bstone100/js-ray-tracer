# My First Ray Tracer
### What is the purpose of this project?
My goal is to get back into 3D graphics programming by making a ray tracer. I'm using the following resources to learn the techniques and algorithms behind ray tracing:

<ul>
  <li><cite><a href="https://raytracing.github.io/books/RayTracingInOneWeekend.html" target="_blank">Ray Tracing in One Weekend</a> by Peter Shirley</cite></li>
  <li><cite><a href="https://gabrielgambetta.com/computer-graphics-from-scratch/" target="_blank">Computer Graphics from Scratch</a> by Gabriel Gambetta</cite></li>
  <li><cite><a href="https://immersivemath.com/ila/tableofcontents.html?" target="_blank">Immersive Linear Algebra</a> by Jacob Ström, Kalle Åström, and Tomas Akenine-Möller</cite></li>
</ul>

### What have you learned so far?
I've learned that the core ray tracing algorithm is quite simple: for each pixel in your canvas, you fire a ray into your scene, grab the color of the object that your ray hit, and paint the pixel that color. To figure out where to shoot your rays, you need to use linear algebra to compute where the viewport is in 3D space, given the location of your camera in 3D space. Checking if your ray hit an object can be more or less complicated, depending on the shape of the object. So far, I've implemented spheres -> cubes -> cylinders -> cones, and each has had a more complicated ray intersection algorithm than the previous one. Each shape also has an algorithm to compute the surface normal at any point on its surface, which you need to compute where your ray should bounce after hitting the object. I haven't yet properly implemented colors; right now all my objects take on the color of the sky.


### Images produced by my ray tracer
These two images were produced with a canvas size of 1000px x 1000px, firing 10 rays per pixel, and allowing rays to bounce at most 10 times. It's the same scene, viewed from two different perspectives.


<img width="500" height="500" alt="some shapes rendered with my ray tracer, viewed from the front" src="https://github.com/user-attachments/assets/1d0b90c6-6cd5-4a49-9964-e814938a5494" />
<img width="500" height="500" alt="some shapes rendered with my ray tracer, viewed from the top-down" src="https://github.com/user-attachments/assets/affd5889-2d93-4cf4-b496-8fabe0abc540" />
