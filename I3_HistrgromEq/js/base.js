(function(imageproc) {
    "use strict";

    /*
     * Build the histogram of the image for a channel
     */
    function buildHistogram(inputData, channel) {
        var histogram = [];
        for (var i = 0; i < 256; i++)
            histogram[i] = 0;

        /**
         * TODO: You need to build the histogram here
         */

        // Accumulate the histogram based on the input channel
        // The input channel can be:
        // "red"   - building a histogram for the red component
        // "green" - building a histogram for the green component
        // "blue"  - building a histogram for the blue component
        // "gray"  - building a histogram for the intensity
        //           (using simple averaging)
        switch (channel) {
            case "red":
                for (var i = 0; i < inputData.data.length; i += 4) {
                    // Find the grayscale value using simple averaging
                    var red = inputData.data[i];
                    // Change the colour to black or white based on the given threshold
                    histogram[red] += 1;
                }
                break;
            case "green":
                for (var i = 0; i < inputData.data.length; i += 4) {
                    // Find the grayscale value using simple averaging
                    var green = inputData.data[i + 1];
                    // Change the colour to black or white based on the given threshold
                    histogram[green] += 1;
                }
                break;
            case "blue":
                for (var i = 0; i < inputData.data.length; i += 4) {
                    // Find the grayscale value using simple averaging
                    var blue = inputData.data[i + 2];
                    // Change the colour to black or white based on the given threshold
                    histogram[blue] += 1;
                }
                break;
            case "gray":
                for (var i = 0; i < inputData.data.length; i += 4) {
                    // Find the grayscale value using simple averaging
                    var grayscale = (inputData.data[i] + inputData.data[i + 1] + inputData.data[i + 2]) / 3;
                    grayscale = Math.round(grayscale);
                    // Change the colour to black or white based on the given threshold
                    histogram[grayscale] += 1;
                }
                break;
        }

        return histogram;
    }

    /*
     * Find the min and max of the histogram
     */
    function findMinMax(histogram, pixelsToIgnore) {
        var min = 0, max = 255;

        /**
         * TODO: You need to build the histogram here
         */

        // Find the minimum in the histogram with non-zero value by
        // ignoring the number of pixels given by pixelsToIgnore
        var pixelsToIgnoreLeft = 0;
        var histogramMin = 0;
        for (histogramMin = 0; histogramMin < 255; histogramMin++) {
            pixelsToIgnoreLeft += histogram[histogramMin];
            if (pixelsToIgnoreLeft > pixelsToIgnore) break;
        }
        for (min = histogramMin; min < 255; min++) {
            if (histogram[min] > 0) break;
        }
        // Find the maximum in the histogram with non-zero value by
        // ignoring the number of pixels given by pixelsToIgnore
        var pixelsToIgnoreRight = 0;
        var histogramMax = 0;
        for (histogramMax = 255; histogramMax >= 0; histogramMax--) {
            pixelsToIgnoreRight += histogram[histogramMax];
            if (pixelsToIgnoreRight > pixelsToIgnore) break;
        }
        for (max = histogramMax; max >= 0; max--) {
            if (histogram[max] > 0) break;
        }


        return {"min": min, "max": max};
    }

    /*
    * Helper function to display grayscale histogram
    */
    function displayHistogramGray(inputData, histogram) {
        // Select the existing SVG using its ID and remove it
        d3.select("#histogram svg").remove();

        // Create a new SVG element to display the histogram
        var svg = d3.select("#histogram").append("svg")
            .attr("width", 480)
            .attr("height", 400)

        // Add x-axis label
        svg.append("text")
        .attr("x", 240)
        .attr("y", 390)
        .style("text-anchor", "middle")
        .text("Intensity");

        // Add y-axis label
        svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -180)
        .attr("y", 20)
        .style("text-anchor", "middle")
        .text("Pixels");
    
        // Create a scale for the x-axis
        var xScale = d3.scaleLinear()
            .domain([0, 255])
            .range([0, 480]);
    
        // Create a scale for the y-axis
        var yScale = d3.scaleLinear()
            .domain([0, d3.max(histogram)])
            .range([360, 0]);
    
        // Create a bar for each bin in the histogram
        var bars = svg.selectAll("rect")
        .data(histogram)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
            return xScale(i);
        })
        .attr("y", function(d) {
            return yScale(d);
        })
        .attr("width", 480 / 256)
        .attr("height", function(d) {
            return 360 - yScale(d);
        });

        // If grayscale image, update all bars to display equalized values
        for (var i = 0; i < inputData.data.length; i += 4) {
            var grayValue = inputData.data[i];
            var equalizedValue = histogram[grayValue];
            var binIndex = Math.floor(equalizedValue / (256 / histogram.length));
            var bin = histogram[binIndex];
            var color = d3.rgb(0, 0, 0);
            bars.filter(function(d, i) {
                return i === binIndex;
            })
            .attr("fill", color);
        }
    }

    /*
    * Helper function to display rgb histogram
    */
    function displayHistogramRGB(inputData, redHistogram, greenHistogram, blueHistogram) {
        var histogram = buildHistogram(inputData, "gray");
    
        // Select the existing SVG using its ID and remove it
        d3.select("#histogram svg").remove();

        /// Create a new SVG element to display the histogram
        var svg = d3.select("#histogram").append("svg")
        .attr("width", 480)
        .attr("height", 400)

        // Add x-axis label
        svg.append("text")
        .attr("x", 240)
        .attr("y", 390)
        .style("text-anchor", "middle")
        .text("Intensity");

        // Add y-axis label
        svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -180)
        .attr("y", 20)
        .style("text-anchor", "middle")
        .text("Pixels");

        // Create a scale for the x-axis
        var xScale = d3.scaleLinear()
            .domain([0, 255])
            .range([0, 480]);

        // Create a scale for the y-axis
        var yScale = d3.scaleLinear()
            .domain([0, d3.max(histogram)])
            .range([360, 0]);

        // Create a bar for each bin in the red histogram
        var redBars = svg.selectAll(".red-bar")
        .data(redHistogram)
        .enter()
        .append("rect")
        .attr("class", "red-bar")
        .attr("x", function(d, i) {
            return xScale(i);
        })
        .attr("y", function(d) {
            return yScale(d);
        })
        .attr("width", 480 / 256)
        .attr("height", function(d) {
            return 360 - yScale(d);
        })
        .attr("fill", "red");

        // Create a bar for each bin in the green histogram
        var greenBars = svg.selectAll(".green-bar")
        .data(greenHistogram)
        .enter()
        .append("rect")
        .attr("class", "green-bar")
        .attr("x", function(d, i) {
            return xScale(i);
        })
        .attr("y", function(d) {
            return yScale(d);
        })
        .attr("width", 480 / 256)
        .attr("height", function(d) {
            return 360 - yScale(d);
        })
        .attr("fill", "green");

        // Create a bar for each bin in the blue histogram
        var blueBars = svg.selectAll(".blue-bar")
        .data(blueHistogram)
        .enter()
        .append("rect")
        .attr("class", "blue-bar")
        .attr("x", function(d, i) {
            return xScale(i);
        })
        .attr("y", function(d) {
            return yScale(d);
        })
        .attr("width", 480 / 256)
        .attr("height", function(d) {
            return 360 - yScale(d);
        })
        .attr("fill", "blue");

        // Update the fill color of each bar based on the equalized value
        for (var i = 0; i < inputData.data.length; i += 4) {
            var redValue = inputData.data[i];
            var greenValue = inputData.data[i + 1];
            var blueValue = inputData.data[i + 2];
            var redEqualizedValue = redHistogram[redValue];
            var greenEqualizedValue = greenHistogram[greenValue];
            var blueEqualizedValue = blueHistogram[blueValue];
            var redBinIndex = Math.floor(redEqualizedValue / (256 / redHistogram.length));
            var greenBinIndex = Math.floor(greenEqualizedValue / (256 / greenHistogram.length));
            var blueBinIndex = Math.floor(blueEqualizedValue / (256 / blueHistogram.length));
            var redBin = redHistogram[redBinIndex];
            var greenBin = greenHistogram[greenBinIndex];
            var blueBin = blueHistogram[blueBinIndex];
            var redColor = d3.rgb(255 * redBin / d3.max(redHistogram), 0, 0);
            var greenColor = d3.rgb(0, 255 * greenBin / d3.max(greenHistogram), 0);
            var blueColor = d3.rgb(0, 0, 255 * blueBin / d3.max(blueHistogram));
            redBars.filter(function(d, i) {
                return i === redBinIndex;
            })
            .attr("fill", redColor);
            greenBars.filter(function(d, i) {
                return i === greenBinIndex;
            })
            .attr("fill", greenColor);
            blueBars.filter(function(d, i) {
                return i === blueBinIndex;
            })
            .attr("fill", blueColor);
        }
    }

    /*
     * Convert the input data to grayscale
     */
    imageproc.grayscale = function(inputData, outputData) {
        console.log("Applying grayscale...");

        var histogram = buildHistogram(inputData, "gray");

        /**
         * TODO: You need to create the grayscale operation here
         */

        for (var i = 0; i < inputData.data.length; i += 4) {
            // Find the grayscale value using simple averaging
            var grayscale = (inputData.data[i] + inputData.data[i + 1] + inputData.data[i + 2]) / 3;
            // Change the RGB components to the resulting value

            outputData.data[i]     = grayscale;
            outputData.data[i + 1] = grayscale;
            outputData.data[i + 2] = grayscale;
        }

        displayHistogramGray(inputData, histogram);
    }

    /*
     * Apply automatic contrast to the input data
     */
    imageproc.autoContrast = function(inputData, outputData, type, percentage) {
        console.log("Applying automatic contrast...");

        // Find the number of pixels to ignore from the percentage
        var pixelsToIgnore = (inputData.data.length / 4) * percentage;

        var histogram, minMax;
        if (type == "gray") {
            // Build the grayscale histogram
            histogram = buildHistogram(inputData, "gray");

            // Find the minimum and maximum grayscale values with non-zero pixels
            minMax = findMinMax(histogram, pixelsToIgnore);
            console.log(minMax);

            var min = minMax.min, max = minMax.max, range = max - min;

            /**
             * TODO: You need to apply the correct adjustment to each pixel
             */

            for (var i = 0; i < inputData.data.length; i += 4) {
                // Adjust each pixel based on the minimum and maximum values

                outputData.data[i]     = (inputData.data[i] - min) * (255 / range);
                outputData.data[i + 1] = (inputData.data[i + 1] - min) * (255 / range);
                outputData.data[i + 2] = (inputData.data[i + 2] - min) * (255 / range);

                // Handle clipping
                if (outputData.data[i] > 255) {
                    outputData.data[i] = 255;
                }
                if (outputData.data[i + 1] > 255) {
                    outputData.data[i + 1] = 255;
                }
                if (outputData.data[i + 2] > 255) {
                    outputData.data[i + 2] = 255;
                }
                if (outputData.data[i] < 0) {
                    outputData.data[i] = 0;
                }
                if (outputData.data[i + 1] < 0) {
                    outputData.data[i + 1] = 0;
                }
                if (outputData.data[i + 2] < 0) {
                    outputData.data[i + 2] = 0;
                }
            }

            // Build the equalized grayscale histogram
            var equalizedHistogram = buildHistogram(outputData, "gray");

            // Display the equalized histogram
            displayHistogramGray(outputData, equalizedHistogram);
        }
        else {
            // Build the grayscale histogram
            var histogramRed = buildHistogram(inputData, "red");
            var histogramGreen = buildHistogram(inputData, "green");
            var histogramBlue = buildHistogram(inputData, "blue");
 
            // Find the minimum and maximum grayscale values with non-zero pixels
            var minMaxRed = findMinMax(histogramRed, pixelsToIgnore);
            var minMaxGreen = findMinMax(histogramGreen, pixelsToIgnore);
            var minMaxBlue = findMinMax(histogramBlue, pixelsToIgnore);
 
            var minRed = minMaxRed.min, maxRed = minMaxRed.max, rangeRed = maxRed - minRed;
            var minGreen = minMaxGreen.min, maxGreen = minMaxGreen.max, rangeGreen = maxGreen - minGreen;
            var minBlue = minMaxBlue.min, maxBlue = minMaxBlue.max, rangeBlue = maxBlue - minBlue;
            
            /**
             * TODO: You need to apply the same procedure for each RGB channel
             *       based on what you have done for the grayscale version
             */

            for (var i = 0; i < inputData.data.length; i += 4) {
                // Adjust each channel based on the histogram of each one

                outputData.data[i]     = (inputData.data[i] - minRed) * (255 / rangeRed);
                outputData.data[i + 1] = (inputData.data[i + 1] - minGreen) * (255 / rangeGreen);
                outputData.data[i + 2] = (inputData.data[i + 2] - minBlue) * (255 / rangeBlue);

                // Handle clipping   
                if (outputData.data[i] > 255) {
                    outputData.data[i] = 255;
                }
                if (outputData.data[i + 1] > 255) {
                    outputData.data[i + 1] = 255;
                }
                if (outputData.data[i + 2] > 255) {
                    outputData.data[i + 2] = 255;
                }
                if (outputData.data[i] < 0) {
                    outputData.data[i] = 0;
                }
                if (outputData.data[i + 1] < 0) {
                    outputData.data[i + 1] = 0;
                }
                if (outputData.data[i + 2] < 0) {
                    outputData.data[i + 2] = 0;
                }
            }

            // Build the equalized grayscale histogram
            var equalizedHistogramRed = buildHistogram(outputData, "red");
            var equalizedHistogramGreen = buildHistogram(outputData, "green");
            var equalizedHistogramBlue = buildHistogram(outputData, "blue");

            // Display the equalized histogram
            displayHistogramRGB(outputData, equalizedHistogramRed, equalizedHistogramGreen, equalizedHistogramBlue);
        }
    }
  
    /*
     * Apply histogram equalization to the input data
     */
    imageproc.histogramEqualization = function(inputData, outputData, type) {
        console.log("Applying histogram equalization...");

        var histogram;
        if (type == "gray") {
            // Build the grayscale histogram
            histogram = buildHistogram(inputData, "gray");

            // Calculate the CDF of the histogram
            var cdf = [];
            for (var i = 0; i < 256; i++) {
                cdf[i] = 0;
            }
            cdf[0] = histogram[0];
            for (var i = 1; i < 256; i++) {
                cdf[i] = cdf[i - 1] + histogram[i];
            }

            // Normalize the CDF
            var normalizedCdf = [];
            for (var i = 0; i < 256; i++) {
                normalizedCdf[i] = 0;
            }
            for (var i = 0; i < 256; i++) {
                normalizedCdf[i] = Math.floor(255 * cdf[i] / cdf[cdf.length - 1]);
            }

            for (var i = 0; i < inputData.data.length; i += 4) {

                outputData.data[i]     = normalizedCdf[inputData.data[i]];
                outputData.data[i + 1] = normalizedCdf[inputData.data[i + 1]];
                outputData.data[i + 2] = normalizedCdf[inputData.data[i + 2]];
            }

            // Build the equalized grayscale histogram
            var equalizedHistogram = buildHistogram(outputData, "gray");

            // Display the equalized histogram
            displayHistogramGray(outputData, equalizedHistogram);
        }
        else {
            // Build the RGB histogram
            var histogramRed = buildHistogram(inputData, "red");
            var histogramGreen = buildHistogram(inputData, "green");
            var histogramBlue = buildHistogram(inputData, "blue");

            // Calculate the CDFs of the RGB histograms
            var cdfRed = [];
            var cdfGreen = [];
            var cdfBlue = [];

            for (var i = 0; i < 256; i++) {
                cdfRed[i] = 0;
                cdfGreen[i] = 0;
                cdfBlue[i] = 0;
            }

            cdfRed[0] = histogramRed[0];
            cdfGreen[0] = histogramGreen[0];
            cdfBlue[0] = histogramBlue[0];

            for (var i = 1; i < 256; i++) {
                cdfRed[i] = cdfRed[i - 1] + histogramRed[i];
                cdfGreen[i] = cdfGreen[i - 1] + histogramGreen[i];
                cdfBlue[i] = cdfBlue[i - 1] + histogramBlue[i];
            }

            // Normalize the CDFs
            var normalizedCdfRed = [];
            var normalizedCdfGreen = [];
            var normalizedCdfBlue = [];

            for (var i = 0; i < 256; i++) {
                normalizedCdfRed[i] = 0;
                normalizedCdfGreen[i] = 0;
                normalizedCdfBlue[i] = 0;
            }

            for (var i = 0; i < 256; i++) {
                normalizedCdfRed[i] = Math.floor(255 * cdfRed[i] / cdfRed[cdfRed.length - 1]);
                normalizedCdfGreen[i] = Math.floor(255 * cdfGreen[i] / cdfGreen[cdfGreen.length - 1]);
                normalizedCdfBlue[i] = Math.floor(255 * cdfBlue[i] / cdfBlue[cdfBlue.length - 1]);
            }

            for (var i = 0; i < inputData.data.length; i += 4) {
                // Adjust each channel based on the histogram of each one

                outputData.data[i]     = normalizedCdfRed[inputData.data[i]];
                outputData.data[i + 1] = normalizedCdfGreen[inputData.data[i + 1]];
                outputData.data[i + 2] = normalizedCdfBlue[inputData.data[i + 2]];
            }

            // Build the equalized grayscale histogram
            var equalizedHistogramRed = buildHistogram(outputData, "red");
            var equalizedHistogramGreen = buildHistogram(outputData, "green");
            var equalizedHistogramBlue = buildHistogram(outputData, "blue");

            // Display the equalized histogram
            displayHistogramRGB(outputData, equalizedHistogramRed, equalizedHistogramGreen, equalizedHistogramBlue);
        }
    }

    /*
     * Helper function to break the input image into blocks
     */
    function breakIntoBlocks(inputData, size) {
        var blocks = [];
        var numBlocksX = Math.ceil(inputData.width / size);
        var numBlocksY = Math.ceil(inputData.height / size);
      
        for (var j = 0; j < numBlocksY; j++) {
          for (var i = 0; i < numBlocksX; i++) {
            var x = i * size;
            var y = j * size;
            var blockWidth = Math.min(size, inputData.width - x);
            var blockHeight = Math.min(size, inputData.height - y);
            var blockData = new Uint8ClampedArray(blockWidth * blockHeight * 4);
            
            for (var ty = 0; ty < blockHeight; ty++) {
              for (var tx = 0; tx < blockWidth; tx++) {
                var srcIdx = ((y + ty) * inputData.width + (x + tx)) * 4;
                var dstIdx = (ty * blockWidth + tx) * 4;
                blockData[dstIdx] = inputData.data[srcIdx];
                blockData[dstIdx + 1] = inputData.data[srcIdx + 1];
                blockData[dstIdx + 2] = inputData.data[srcIdx + 2];
                blockData[dstIdx + 3] = inputData.data[srcIdx + 3];
              }
            }
      
            blocks.push({
              data: blockData,
              width: blockWidth,
              height: blockHeight,
              x: x,
              y: y
            });
          }
        }
      
        return blocks;
    }

    /*
     * Apply histogram equalization to the input data
     */
    imageproc.adaptiveHistogramEqualization = function(inputData, outputData, type, size) {
        console.log("Applying adaptive histogram equalization...");
    
        // Break the inputData into blocks of size * size
        var blocks = breakIntoBlocks(inputData, size);

        // Adjust each channel based on the histogram of each one for each block
        for (var i = 0; i < blocks.length; i++) {

            var block = blocks[i];
            if (type == "gray") {
                // Compute the histogram for the gray channel
                var histogram = new Array(256).fill(0);

                for (var ty = 0; ty < block.height; ty++) {
                    for (var tx = 0; tx < block.width; tx++) {
                        // Find the grayscale value using simple averaging
                        var grayscale = (inputData.data[(block.y + ty) * inputData.width * 4 + (block.x + tx) * 4] +
                                         inputData.data[(block.y + ty) * inputData.width * 4 + (block.x + tx) * 4 + 1] +
                                         inputData.data[(block.y + ty) * inputData.width * 4 + (block.x + tx) * 4 + 2]) / 3;
                        grayscale = Math.round(grayscale);
                        // Change the colour to black or white based on the given threshold
                        histogram[grayscale] += 1;
                    }
                }

                // Compute the cumulative histogram for the gray channel
                var cdf = new Array(256).fill(0);
                cdf[0] = histogram[0];
                
                for (var j = 1; j < 256; j++) {
                    cdf[j] = cdf[j - 1] + histogram[j];
                }

                // Normalize the cumulative histogram for the gray channel
                var normalizedCdf = new Array(256).fill(0);
                for (var j = 0; j < 256; j++) {
                    normalizedCdf[j] = Math.floor(255 * cdf[j] / (block.width * block.height));
                }

                // Apply the histogram equalization to the gray channel
                for (var ty = 0; ty < block.height; ty++) {
                    for (var tx = 0; tx < block.width; tx++) {
                        
                        var index = (block.y + ty) * inputData.width * 4 + (block.x + tx) * 4;
                        outputData.data[index]     = normalizedCdf[inputData.data[index]];
                        outputData.data[index + 1] = normalizedCdf[inputData.data[index + 1]];
                        outputData.data[index + 2] = normalizedCdf[inputData.data[index + 2]];
                    }
                }
            }
            else {
                // Compute the histogram for the gray channel
                var histogramRed   = new Array(256).fill(0);
                var histogramGreen = new Array(256).fill(0);
                var histogramBlue  = new Array(256).fill(0);

                for (var ty = 0; ty < block.height; ty++) {
                    for (var tx = 0; tx < block.width; tx++) {
                        // Find the grayscale value using simple averaging
                        var red   = inputData.data[(block.y + ty) * inputData.width * 4 + (block.x + tx) * 4]; 
                        var green = inputData.data[(block.y + ty) * inputData.width * 4 + (block.x + tx) * 4 + 1];
                        var blue  = inputData.data[(block.y + ty) * inputData.width * 4 + (block.x + tx) * 4 + 2];
       
                        // Change the colour to black or white based on the given threshold
                        histogramRed[red]     += 1;
                        histogramGreen[green] += 1;
                        histogramBlue[blue]   += 1;
                    }
                }

                // Compute the cumulative histogram for the gray channel
                var cdfRed = new Array(256).fill(0);
                var cdfGreen = new Array(256).fill(0);
                var cdfBlue = new Array(256).fill(0);

                cdfRed[0] = histogramRed[0];
                cdfGreen[0] = histogramGreen[0];
                cdfBlue[0] = histogramBlue[0];

                for (var j = 1; j < 256; j++) {
                    cdfRed[j] = cdfRed[j - 1] + histogramRed[j];
                    cdfGreen[j] = cdfGreen[j - 1] + histogramGreen[j];
                    cdfBlue[j] = cdfBlue[j - 1] + histogramBlue[j];
                }

                // Normalize the cumulative histogram for the gray channel
                var normalizedCdfRed = new Array(256).fill(0);
                var normalizedCdfGreen = new Array(256).fill(0);
                var normalizedCdfBlue = new Array(256).fill(0);

                for (var j = 0; j < 256; j++) {
                    normalizedCdfRed[j] = Math.floor(255 * cdfRed[j] / (block.width * block.height));
                    normalizedCdfGreen[j] = Math.floor(255 * cdfGreen[j] / (block.width * block.height));
                    normalizedCdfBlue[j] = Math.floor(255 * cdfBlue[j] / (block.width * block.height));
                }

                // Apply the histogram equalization to the gray channel
                for (var ty = 0; ty < block.height; ty++) {
                    for (var tx = 0; tx < block.width; tx++) {
                        
                        var index = (block.y + ty) * inputData.width * 4 + (block.x + tx) * 4;
                        outputData.data[index]     = normalizedCdfRed[inputData.data[index]];
                        outputData.data[index + 1] = normalizedCdfGreen[inputData.data[index + 1]];
                        outputData.data[index + 2] = normalizedCdfBlue[inputData.data[index + 2]];
                    }
                }
            }

            if (type == "gray") {
                // Build the equalized grayscale histogram
                var equalizedHistogram = buildHistogram(outputData, "gray");

                // Display the equalized histogram
                displayHistogramGray(outputData, equalizedHistogram);
            }
            else {
                // Build the equalized grayscale histogram
                var equalizedHistogramRed = buildHistogram(outputData, "red");
                var equalizedHistogramGreen = buildHistogram(outputData, "green");
                var equalizedHistogramBlue = buildHistogram(outputData, "blue");

                // Display the equalized histogram
                displayHistogramRGB(outputData, equalizedHistogramRed, equalizedHistogramGreen, equalizedHistogramBlue);
            }
        }     
    }

    /*
     * Apply histogram equalization to the input data
     */
    imageproc.contrastLimitedAdaptiveHistogramEqualization = function(inputData, outputData, type, size, clipLimit) {
        console.log("Applying contrast limited adaptive histogram equalization...");
    
        // Break the inputData into blocks of size * size
        var blocks = breakIntoBlocks(inputData, size);

        // Adjust each channel based on the histogram of each one for each block
        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            if (type == "gray") {
                // Compute the histogram for the gray channel
                var histogram = new Array(256).fill(0);

                for (var ty = 0; ty < block.height; ty++) {
                    for (var tx = 0; tx < block.width; tx++) {
                        // Find the grayscale value using simple averaging
                        var grayscale = (inputData.data[(block.y + ty) * inputData.width * 4 + (block.x + tx) * 4] +
                                         inputData.data[(block.y + ty) * inputData.width * 4 + (block.x + tx) * 4 + 1] +
                                         inputData.data[(block.y + ty) * inputData.width * 4 + (block.x + tx) * 4 + 2]) / 3;
                        grayscale = Math.round(grayscale);
                        // Change the colour to black or white based on the given threshold
                        histogram[grayscale] += 1;
                    }
                }

                // Compute the cumulative histogram for the gray channel
                var cdf = new Array(256).fill(0);
                cdf[0] = histogram[0];
                
                for (var j = 1; j < 256; j++) {
                    cdf[j] = cdf[j - 1] + histogram[j];
                }

                // Normalize the cumulative histogram for the gray channel
                var normalizedCdf = new Array(256).fill(0);
                for (var j = 0; j < 256; j++) {
                    normalizedCdf[j] = Math.floor(255 * cdf[j] / (block.width * block.height));
                }

                // Clip the CDF by setting values above the clip value to the clip value
                var Threshold = (clipLimit * 25.5) * cdf[cdf.length - 1] / 256; 
                console.log(`Clip limit for block ${i}: ${Threshold}`);

                for (var j = 0; j < cdf.length; j++) {
                    // console.log(cdf.join(","));
                    if (cdf[j] > Threshold) {
                      cdf[j] = Threshold;
                    }
                }

                // Redistribute the clipped values equally among all other values in the CDF
                var clippedCount = 0;
                for (var j = 0; j < cdf.length; j++) {
                    if (cdf[j] > Threshold) {
                        clippedCount += cdf[j] - Threshold;
                        cdf[j] = Threshold;
                    }
                }

                var addedValue = clippedCount / cdf.length;
                for (var j = 0; j < cdf.length; j++) {
                    cdf[j] += addedValue;
                }

                // Re-normalize the CDF
                var renormalizedCdf = new Array(256).fill(0);
                for (let j = 0; j < 256; j++) {
                    renormalizedCdf[j] = Math.round(cdf[j] * 255 / cdf[cdf.length - 1]);
                }

                // Apply the histogram equalization to the gray channel
                for (var ty = 0; ty < block.height; ty++) {
                    for (var tx = 0; tx < block.width; tx++) {
                        
                        var index = (block.y + ty) * inputData.width * 4 + (block.x + tx) * 4;
                        outputData.data[index]     = renormalizedCdf[inputData.data[index]];
                        outputData.data[index + 1] = renormalizedCdf[inputData.data[index + 1]];
                        outputData.data[index + 2] = renormalizedCdf[inputData.data[index + 2]];
                    }
                }
            }
            else {
                // Compute the histogram for the RGB channel
                var histogramRed   = new Array(256).fill(0);
                var histogramGreen = new Array(256).fill(0);
                var histogramBlue  = new Array(256).fill(0);

                for (var ty = 0; ty < block.height; ty++) {
                    for (var tx = 0; tx < block.width; tx++) {
                        // Find the grayscale value using simple averaging
                        var red   = inputData.data[(block.y + ty) * inputData.width * 4 + (block.x + tx) * 4]; 
                        var green = inputData.data[(block.y + ty) * inputData.width * 4 + (block.x + tx) * 4 + 1];
                        var blue  = inputData.data[(block.y + ty) * inputData.width * 4 + (block.x + tx) * 4 + 2];
       
                        // Change the colour to black or white based on the given threshold
                        histogramRed[red]     += 1;
                        histogramGreen[green] += 1;
                        histogramBlue[blue]   += 1;
                    }
                }

                // Compute the cumulative histogram for the gray channel
                var cdfRed = new Array(256).fill(0);
                var cdfGreen = new Array(256).fill(0);
                var cdfBlue = new Array(256).fill(0);

                cdfRed[0] = histogramRed[0];
                cdfGreen[0] = histogramGreen[0];
                cdfBlue[0] = histogramBlue[0];

                for (var j = 1; j < 256; j++) {
                    cdfRed[j] = cdfRed[j - 1] + histogramRed[j];
                    cdfGreen[j] = cdfGreen[j - 1] + histogramGreen[j];
                    cdfBlue[j] = cdfBlue[j - 1] + histogramBlue[j];
                }

                // Normalize the cumulative histogram for the gray channel
                var normalizedCdfRed = new Array(256).fill(0);
                var normalizedCdfGreen = new Array(256).fill(0);
                var normalizedCdfBlue = new Array(256).fill(0);

                for (var j = 0; j < 256; j++) {
                    normalizedCdfRed[j] = Math.floor(255 * cdfRed[j] / (block.width * block.height));
                    normalizedCdfGreen[j] = Math.floor(255 * cdfGreen[j] / (block.width * block.height));
                    normalizedCdfBlue[j] = Math.floor(255 * cdfBlue[j] / (block.width * block.height));
                }

                // Clip the CDF by setting values above the clip value to the clip value
                var ThresholdRed = clipLimit * 25.5 * cdfRed[cdfRed.length - 1] / 256; 
                var ThresholdGreen = clipLimit * 25.5 * cdfGreen[cdfGreen.length - 1] / 256; 
                var ThresholdBlue = clipLimit * 25.5 * cdfBlue[cdfBlue.length - 1] / 256; 
                console.log(`Clip limit for block R ${i}: ${ThresholdRed}`);
                console.log(`Clip limit for block G ${i}: ${ThresholdGreen}`);
                console.log(`Clip limit for block B ${i}: ${ThresholdBlue}`);


                for (var j = 0; j < cdfRed.length; j++) {
                    // console.log(cdf.join(","));
                    if (cdfRed[j] > ThresholdRed) {
                      cdfRed[j] = ThresholdRed;
                    }
                }
                for (var j = 0; j < cdfGreen.length; j++) {
                    // console.log(cdf.join(","));
                    if (cdfGreen[j] > ThresholdGreen) {
                      cdfGreen[j] = ThresholdGreen;
                    }
                }
                for (var j = 0; j < cdfBlue.length; j++) {
                    // console.log(cdf.join(","));
                    if (cdfBlue[j] > ThresholdBlue) {
                      cdfBlue[j] = ThresholdBlue;
                    }
                }

                // Redistribute the clipped values equally among all other values in the CDF
                var clippedCountRed = 0;
                for (var j = 0; j < cdfRed.length; j++) {
                    if (cdfRed[j] > ThresholdRed) {
                        clippedCountRed += cdfRed[j] - ThresholdRed;
                        cdfRed[j] = ThresholdRed;
                    }
                }
                var clippedCountGreen = 0;
                for (var j = 0; j < cdfGreen.length; j++) {
                    if (cdfGreen[j] > ThresholdGreen) {
                        clippedCountGreen += cdfGreen[j] - ThresholdGreen;
                        cdfGreen[j] = ThresholdGreen;
                    }
                }
                var clippedCountBlue = 0;
                for (var j = 0; j < cdfBlue.length; j++) {
                    if (cdfBlue[j] > ThresholdBlue) {
                        clippedCountBlue += cdfBlue[j] - ThresholdBlue;
                        cdfBlue[j] = ThresholdBlue;
                    }
                }

                var addedValueRed = clippedCountRed / cdfRed.length;
                for (var j = 0; j < cdfRed.length; j++) {
                    cdfRed[j] += addedValueRed;
                }
                var addedValueGreen = clippedCountGreen / cdfGreen.length;
                for (var j = 0; j < cdfGreen.length; j++) {
                    cdfGreen[j] += addedValueGreen;
                }
                var addedValueBlue = clippedCountBlue / cdfBlue.length;
                for (var j = 0; j < cdfBlue.length; j++) {
                    cdfBlue[j] += addedValueBlue;
                }

                // Re-normalize the CDF
                var renormalizedCdfRed = new Array(256).fill(0);
                for (let j = 0; j < 256; j++) {
                    renormalizedCdfRed[j] = Math.round(cdfRed[j] * 255 / cdfRed[cdfRed.length - 1]);
                }
                var renormalizedCdfGreen = new Array(256).fill(0);
                for (let j = 0; j < 256; j++) {
                    renormalizedCdfGreen[j] = Math.round(cdfGreen[j] * 255 / cdfGreen[cdfGreen.length - 1]);
                }
                var renormalizedCdfBlue = new Array(256).fill(0);
                for (let j = 0; j < 256; j++) {
                    renormalizedCdfBlue[j] = Math.round(cdfBlue[j] * 255 / cdfBlue[cdfBlue.length - 1]);
                }

                // Apply the histogram equalization to the gray channel
                for (var ty = 0; ty < block.height; ty++) {
                    for (var tx = 0; tx < block.width; tx++) {
                        
                        var index = (block.y + ty) * inputData.width * 4 + (block.x + tx) * 4;
                        outputData.data[index]     = renormalizedCdfRed[inputData.data[index]];
                        outputData.data[index + 1] = renormalizedCdfGreen[inputData.data[index + 1]];
                        outputData.data[index + 2] = renormalizedCdfBlue[inputData.data[index + 2]];
                    }
                }
            }

            if (type == "gray") {
                // Build the equalized grayscale histogram
                var equalizedHistogram = buildHistogram(outputData, "gray");

                // Display the equalized histogram
                displayHistogramGray(outputData, equalizedHistogram);
            }
            else {
                // Build the equalized grayscale histogram
                var equalizedHistogramRed = buildHistogram(outputData, "red");
                var equalizedHistogramGreen = buildHistogram(outputData, "green");
                var equalizedHistogramBlue = buildHistogram(outputData, "blue");

                // Display the equalized histogram
                displayHistogramRGB(outputData, equalizedHistogramRed, equalizedHistogramGreen, equalizedHistogramBlue);
            }
        }     
    }

}(window.imageproc = window.imageproc || {}));