(function(imageproc) {
    "use strict";

    /*
     * Apply blur to the input data
     */
    imageproc.blur = function(inputData, outputData, kernelSize) {
        console.log("Applying blur...");

        // You are given a 3x3 kernel but you need to create a proper kernel
        // using the given kernel size
        var kernel = [];
        var kernelValue = 1 / (kernelSize * kernelSize);
        for (var i = 0; i < kernelSize; i++) {
            kernel[i] = [];
            for (var j = 0; j < kernelSize; j++) {
                kernel[i][j] = kernelValue;
            }
        }

        /**
         * TODO: You need to extend the blur effect to include different
         * kernel sizes and then apply the kernel to the entire image
         */

        // Apply the kernel to the whole image
        for (var y = 0; y < inputData.height; y++) {
            for (var x = 0; x < inputData.width; x++) {
                // Use imageproc.getPixel() to get the pixel values
                // over the kernel
                var rSum = 0; 
                var gSum = 0; 
                var bSum = 0;

                for (var i = -Math.floor(kernelSize / 2); i <= Math.floor(kernelSize / 2); i++) {
                    for (var j = -Math.floor(kernelSize / 2); j <= Math.floor(kernelSize / 2); j++) {
                        var pixel = imageproc.getPixel(inputData, x + i, y + j);
                        var coefficient = kernel[i + Math.floor(kernelSize / 2)][j + Math.floor(kernelSize / 2)];
                        rSum += pixel.r * coefficient;
                        gSum += pixel.g * coefficient;
                        bSum += pixel.b * coefficient;
                    }
                }

                // Then set the blurred result to the output data
                
                var i = (x + y * outputData.width) * 4;
                outputData.data[i]     = rSum;
                outputData.data[i + 1] = gSum;
                outputData.data[i + 2] = bSum;
            }
        }
    } 

}(window.imageproc = window.imageproc || {}));
