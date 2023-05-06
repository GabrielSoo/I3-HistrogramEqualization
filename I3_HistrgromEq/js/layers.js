(function(imageproc) {
    "use strict";

    /*
     * Apply the basic processing operations
     */
    function applyBasicOp(inputImage, outputImage) {
        switch (currentBasicOp) {
            // Apply grayscale
            case "grayscale":
                imageproc.grayscale(inputImage, outputImage);
                break;
                
            // Apply automatic contrast
            case "auto-contrast":
                var type = $("#auto-contrast-type").val();
                var percentage = parseInt($("#auto-contrast-percentage").val()) / 100.0;
                imageproc.autoContrast(inputImage, outputImage, type, percentage);
                break;

            // Apply histogram equalization
            case "histogram-equalization":
                var type = $("#histogram-equalization-type").val();
                imageproc.histogramEqualization(inputImage, outputImage, type);
                break;

            // Apply adaptive histogram equalization
            case "adaptive-histogram-equalization":
                var type = $("#adaptive-histogram-equalization-type").val();
                var size = parseInt($("#block-size").val());
                imageproc.adaptiveHistogramEqualization(inputImage, outputImage, type, size);
                break;

            // Apply contrast limited adaptive histogram equalization
            case "contrast-limited-adaptive-histogram-equalization":
                var type = $("#contrast-limited-adaptive-histogram-equalization-type").val();
                var size = parseInt($("#block-siz").val());
                var clipLimit = parseInt($("#clip-limit").val());
                imageproc.contrastLimitedAdaptiveHistogramEqualization(inputImage, outputImage, type, size, clipLimit);
                break;
        }
    }

    /*
     * Apply the base layer operations
     */
    function applyBaseLayerOp(inputImage, processedImage, outputImage) {
        switch (currentBaseLayerOp) {
            // Apply blur
            case "blur":
                if ($("#blur-input").val() == "processed")
                    inputImage = processedImage;
                var size = parseInt($("#blur-kernel-size").val());
                imageproc.blur(inputImage, outputImage, size);
                break;

            // Apply kuwahara
            case "kuwahara":
                if ($("#kuwahara-input").val() == "processed")
                    inputImage = processedImage;
                var size = parseInt($("#kuwahara-filter-size").val());
                imageproc.kuwahara(inputImage, outputImage, size);
                break;
        }
    }

    /*
     * Apply the shade layer operations
     */
    function applyShadeLayerOp(inputImage, processedImage, outputImage) {
        switch (currentShadeLayerOp) {
            // Apply dither
            case "dither":
                if ($("#dither-input").val() == "processed")
                    inputImage = processedImage;
                imageproc.dither(inputImage, outputImage,
                                 $("#dither-matrix-type").val());
                break;
        }
    }

    /*
     * Apply the outline layer operations
     */
    function applyOutlineLayerOp(inputImage, processedImage, outputImage) {
        switch (currentOutlineLayerOp) {
            // Apply sobel edge detection
            case "sobel":
                if ($("#sobel-input").val() == "processed")
                    inputImage = processedImage;

                // Use the grayscale image
                var grayscale = imageproc.createBuffer(outputImage);
                imageproc.grayscale(inputImage, grayscale);

                // Blur if needed
                if ($("#sobel-blur").prop("checked")) {
                    var blur = imageproc.createBuffer(outputImage);
                    var size = parseInt($("#sobel-blur-kernel-size").val());
                    imageproc.blur(grayscale, blur, size);
                    grayscale = blur;
                }

                var threshold = parseInt($("#sobel-threshold").val());
                imageproc.sobelEdge(grayscale, outputImage, threshold);

                // Flip edge values
                if ($("#sobel-flip").prop("checked")) {
                    for (var i = 0; i < outputImage.data.length; i+=4) {
                        if (outputImage.data[i] == 0) {
                            outputImage.data[i]     =
                            outputImage.data[i + 1] =
                            outputImage.data[i + 2] = 255;
                        }
                        else {
                            outputImage.data[i]     =
                            outputImage.data[i + 1] =
                            outputImage.data[i + 2] = 0;
                        }
                    }
                }
                break;
        }
    }

    /*
     * The image processing operations are set up for the different layers.
     * Operations are applied from the base layer to the outline layer. These
     * layers are combined appropriately when required.
     */
    imageproc.operation = function(inputImage, outputImage) {
        // Apply the basic processing operations
        var processedImage = inputImage;
        if (currentBasicOp != "no-op") {
            processedImage = imageproc.createBuffer(outputImage);
            applyBasicOp(inputImage, processedImage);
        }

        // Apply the base layer operations
        var baseLayer = processedImage;
        if (currentBaseLayerOp != "no-op") {
            baseLayer = imageproc.createBuffer(outputImage);
            applyBaseLayerOp(inputImage, processedImage, baseLayer);
        }

        // Apply the shade layer operations
        var shadeLayer = baseLayer;
        if (currentShadeLayerOp != "no-op") {
            shadeLayer = imageproc.createBuffer(outputImage);
            applyShadeLayerOp(inputImage, processedImage, shadeLayer);

            // Show base layer for dithering
            if (currentShadeLayerOp == "dither" &&
                $("#dither-transparent").prop("checked")) {

                /**
                 * TODO: You need to show the base layer (baseLayer) for
                 * the white pixels (transparent)
                 */
                for (var i = 0; i < shadeLayer.data.length; i += 4) {
                    if (shadeLayer.data[i] == 255 && shadeLayer.data[i + 1] == 255 && shadeLayer.data[i + 2] == 255) {
                        shadeLayer.data[i] = baseLayer.data[i];
                        shadeLayer.data[i + 1] = baseLayer.data[i + 1];
                        shadeLayer.data[i + 2] = baseLayer.data[i + 2];
                    }
                }
            }
        }

        // Apply the outline layer operations
        var outlineLayer = shadeLayer;
        if (currentOutlineLayerOp != "no-op") {
            outlineLayer = imageproc.createBuffer(outputImage);
            applyOutlineLayerOp(inputImage, processedImage, outlineLayer);

            // Show shade layer for non-edge pixels
            if (currentOutlineLayerOp == "sobel" &&
                $("#sobel-transparent").prop("checked")) {

                /**
                 * TODO: You need to show the shade layer (shadeLayer) for
                 * the non-edge pixels (transparent)
                 */
                for (var i = 0; i < outlineLayer.data.length; i+=4) {
                    if ( $("#sobel-flip").prop("checked") && outlineLayer.data[i]==255 || !$("#sobel-flip").prop("checked") && outlineLayer.data[i]==0) {
                        outlineLayer.data[i]   = shadeLayer.data[i];
                        outlineLayer.data[i+1] = shadeLayer.data[i+1];
                        outlineLayer.data[i+2] = shadeLayer.data[i+2];
                    }
                }
            }
        }

        // Show the accumulated image
        imageproc.copyImageData(outlineLayer, outputImage);
    }
 
}(window.imageproc = window.imageproc || {}));
