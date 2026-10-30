# TODO

## Features

- [x] Implement colors for diffuse materials
- [ ] Build axes using cylinders and cones
  - [ ] this requires first allowing cylinders and cones to be rotated
  - [ ] that means changing the intersection and surface normal algorithms
  - [ ] we need to be able to invert a matrix
- [x] Implement a reflective material
- [ ] Implement lights
- [ ] Break up code into classes, like matrix, vector, each shape
- [ ] Implement shadows
- [ ] Be able to swap in different scenes
- [ ] Be able to move the camera around
- [x] Make painting non-blocking
- [x] Make ray tracing parallelized using web workers
- [x] Add UI for editing the ray tracing parameters
- [ ] Do progressive refinement
  - [ ] do one or more low res passes over the full image
  - [ ] could apply a blur filter and reduce its strength every pass 

## Bugs

- [ ] Figure out why the tops of metal cylinders aren't reflecting
