(function(imageproc) {
    "use strict";

    /*
     * Apply sobel edge to the input data
     */
    imageproc.sobelEdge = function(inputData, outputData, threshold) {
        console.log("Applying Sobel edge detection...");

        /* Initialize the two edge kernel Gx and Gy */
        var Gx = [
            [-1, 0, 1],
            [-2, 0, 2],
            [-1, 0, 1]
        ];
        var Gy = [
            [-1,-2,-1],
            [ 0, 0, 0],
            [ 1, 2, 1]
        ];

        /**
         * TODO: You need to write the code to apply
         * the two edge kernels appropriately
         */
        
        for (var y = 0; y < inputData.height; y++) {
            for (var x = 0; x < inputData.width; x++) {

                var G_value = 0;
                var Gx_value = 0;
                var Gy_value = 0;
                
                for (var j = -1; j <= 1; j++) {
                    for (var i = -1; i <= 1; i++) {
                        var pixel = imageproc.getPixel(inputData, x + i, y + j);
                        var value = (pixel.r + pixel.g + pixel.b) / 3;
                        Gx_value += Gx[j + 1][i + 1] * value;
                        Gy_value += Gy[j + 1][i + 1] * value;
                    }
                }
                G_value = Math.hypot(Gx_value, Gy_value);

                var i = (x + y * outputData.width) * 4;
                outputData.data[i]     =
                outputData.data[i + 1] =
                outputData.data[i + 2] = (G_value < threshold) ? 0 : 255;
            }
        }
    } 

}(window.imageproc = window.imageproc || {}));
