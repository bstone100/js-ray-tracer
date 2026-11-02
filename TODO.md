# TODO

## Features

- [x] Implement colors for diffuse materials
- [x] Build axes using cylinders and cones
  - [x] this requires first allowing cylinders and cones to be rotated
  - [x] that means changing the intersection and surface normal algorithms
  - [x] we need to be able to invert a matrix
  - [ ] also allow rotating boxes and spheres
    - [ ] but first implement a matrix and vector class
- [x] Implement a reflective material
- [ ] Implement lights
- [ ] Break up code into classes, like matrix, vector, each shape
- [ ] Implement shadows
- [ ] Be able to swap in different scenes
  - [ ] Scene should probably be a JSON file
- [ ] Be able to load in 3D models
  - [ ] Probably starting with .obj files
  - [ ] I think this will require implementing triangle intersection and surface normal algorithms
- [ ] Be able to move the camera around
  - [ ] This is probably not feasible until we switch to GPU rendering 
  - [ ] could add simple controls for jogging the camera
- [x] Make painting non-blocking
- [x] Make ray tracing parallelized using web workers
  - [x] Make it so that there is only one group of web workers, whereas currently each new render is spawning a new group
- [x] Add UI for editing the ray tracing parameters
- [ ] Do progressive refinement
  - [ ] do one or more low res passes over the full image
  - [ ] could apply a blur filter and reduce its strength every pass
  - [ ] this is just a special effect and isn't necessary as long as we are in some way showing the user the progress of the current ray trace
- [ ] Implement textures
- [ ] Investigate using a GPU shader instead of doing CPU ray tracing
- [x] Make it so that running a new render on the same view visually overwrites the previous pixels
  - [x] Do this with no performance cost
- [ ] Should turn scene into a tree data structure so that bounding volumes can be computed for groups of objects
- [ ] Add controls for modifying a scene
  - [ ] Be able to spawn a primitive and modify its material
  - [ ] Be able to select and modify properties of existing primitives or other objects
- [ ] Can implement selecting an object by clicking on it
  - [ ] This is just a ray hit test under the cursor
- [ ] Could add a tree view for inspecting the scene

## Bugs

- [x] Figure out why the tops of metal cylinders aren't reflecting
  - [x] I think this isn't actually a bug because they are reflecting when viewed from a different angle
