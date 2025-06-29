const fs = require("fs")
const path = require("path")
const csv = require("csv-parser")

function analyzeCsv(filePath) {
  const results = []
  const columnData = {}
  let rowCount = 0

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("headers", (headers) => {
      headers.forEach((header) => {
        columnData[header] = {
          type: null,
          uniqueValues: new Set(),
          minLength: Number.POSITIVE_INFINITY,
          maxLength: 0,
          sum: 0,
          count: 0,
          numericCount: 0,
        }
      })
    })
    .on("data", (data) => {
      rowCount++
      for (const column in data) {
        const value = data[column]
        columnData[column].uniqueValues.add(value)
        columnData[column].count++

        if (value !== null && value !== undefined && value !== "") {
          const len = value.length
          if (len < columnData[column].minLength) {
            columnData[column].minLength = len
          }
          if (len > columnData[column].maxLength) {
            columnData[column].maxLength = len
          }

          const numValue = Number(value)
          if (!isNaN(numValue) && value.trim() !== "") {
            columnData[column].numericCount++
            columnData[column].sum += numValue
          }
        }
      }
      results.push(data)
    })
    .on("end", () => {
      console.log(`CSV analysis for: ${filePath}`)
      console.log(`Total rows: ${rowCount}`)
      console.log("\nColumn Analysis:")

      for (const column in columnData) {
        const col = columnData[column]
        let type = "string"
        if (col.numericCount === col.count && col.count > 0) {
          type = "number"
        } else if (col.uniqueValues.has("true") || col.uniqueValues.has("false")) {
          type = "boolean"
        }

        console.log(`\n--- Column: ${column} ---`)
        console.log(`  Inferred Type: ${type}`)
        console.log(`  Unique Values: ${col.uniqueValues.size}`)
        console.log(`  Min Length: ${col.minLength === Number.POSITIVE_INFINITY ? "N/A" : col.minLength}`)
        console.log(`  Max Length: ${col.maxLength === 0 ? "N/A" : col.maxLength}`)
        if (type === "number") {
          console.log(`  Average Value: ${col.numericCount > 0 ? (col.sum / col.numericCount).toFixed(2) : "N/A"}`)
        }
      }

      console.log("\nCSV analysis complete.")
      console.log("Number of rows:", results.length)
      if (results.length > 0) {
        console.log("Headers:", Object.keys(results[0]))
        console.log("First 5 rows:", results.slice(0, 5))
      }
    })
    .on("error", (error) => {
      console.error("Error reading CSV:", error.message)
    })
}

// Example usage:
// const csvFilePath = path.join(__dirname, 'your_file.csv');
// analyzeCsv(csvFilePath);

// To run this script, save it as e.g., analyze-csv.js
// and execute with `node analyze-csv.js path/to/your/file.csv`
// Make sure to install csv-parser: `npm install csv-parser`
