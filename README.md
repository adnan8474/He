# POCTify

POCTify is a simple web application to review Point-of-Care EQA results before submitting them.

## Setup

1. Install dependencies
   ```bash
   npm install
   ```
2. Start development server
   ```bash
   npm run dev
   ```
3. Build for production
   ```bash
   npm run build
   ```

The app is built with React, Vite and Tailwind CSS. It processes CSV or XLSX files in the format shown in `public/template.csv`.

## Analysis Modes

POCTify now offers three dedicated modes selectable from the dashboard:

1. **EQA Comparison** – Compare the same sample across multiple devices. Shows
   Bland–Altman charts for every device pair and highlights samples that differ
   by more than 0.5 mmol/L.
2. **Device Verification** – Method comparison where different samples are run
   on two devices. Includes correlation and regression statistics in addition to
   Bland–Altman plots.
3. **Internal Precision** – Review repeat testing on a single device. Displays
   mean, SD and CV% with a Levey–Jennings chart for selected analytes.

## Features

- **Upload CSV/XLSX**: Drag and drop your EQA result files directly into the dashboard.
- **Summary statistics**: Quickly review device-level mean, SD and CV% with automatic colour coding.
- **Trend chart**: Visualise measured versus target values over time.
- **Bland-Altman analysis**: Compare devices on a per-sample basis or between methods.
- **Regression and correlation**: Automatic linear regression when using the Device Verification mode.
- **Levey-Jennings**: Inspect internal precision with mean and ±2SD lines.
- **Export reports**: Download your cleaned dataset or the inter-device summary as CSV. Generate PDFs of any section for offline review.

## File format

The application expects at minimum the following columns:

```
sample_id,device_id,analyte,test_date,measured_value,target_value
```

If `sample_id` is not provided, inter-device comparison will be skipped. Dates may be UK or US formatted; they are treated as strings for the purposes of analysis.

## Local Development

1. Clone the repository and install dependencies as shown above.
2. Run `npm run dev` and open the provided localhost URL.
3. Any changes to files under `src/` will trigger hot reload.

### Building for Production

The project can be built without network access once dependencies are installed:

```bash
npm run build
```

The compiled files will appear in the `dist/` directory. Deploy this folder to any static host such as Netlify.

## Netlify Deployment

This repository includes a `netlify.toml` that instructs Netlify to run `npm run build` and publish the `dist` directory. A `_redirects` file is also provided so that the React router works correctly.

## Contributing

1. Fork the repo and create a feature branch.
2. Follow the existing coding style—functional React components and utility modules under `src/utils`.
3. Run `npm run build` before committing to ensure the app still compiles (in this environment the command may fail due to missing dependencies, but you should run it anyway).
4. Submit a pull request describing your changes.

## License

This project is provided for educational purposes and is not a validated medical device. Use at your own risk.

## FAQ

### Why do I see an empty page after deploying?

Make sure your hosting platform serves `index.html` for all routes. If using Netlify,
the included `_redirects` file handles this automatically. For other static hosts
you may need to configure rewrite rules manually.

### How can I analyse results for more than three devices?

POCTify automatically detects all unique `device_id` values in the file. The
Bland-Altman section generates a comparison for every possible pair. If you have
five devices you will see ten pairs. Use the buttons above the chart to switch
between them.

### Does the app store my data anywhere?

No. All calculations happen entirely in your browser. Files are not uploaded to
any server and remain on your machine unless you export them yourself.

### What if my CSV uses semicolons instead of commas?

Currently the parser expects comma separated values. Open your file in a text
editor and replace semicolons with commas or save it as a standard CSV from Excel.

### I found a bug, how do I report it?

Please open an issue or pull request on GitHub. Include details about your
browser and attach a minimal sample file that reproduces the problem.

### Can I contribute new statistical methods?

Yes! Check out `src/utils/advancedStats.js` for ideas on how additional
analytical tools could be structured. Pull requests are welcome.

## Troubleshooting

1. **`vite: not found` when running build** – Ensure dependencies are installed.
   Run `npm install` in the project directory. In some restricted environments
   you may not have network access which prevents installation.
2. **Charts not showing** – Verify that `chart.js` and `react-chartjs-2` are
   installed. Re-run `npm install` if necessary.
3. **Blank screen after upload** – Open the browser console to check for
   JavaScript errors. Most often this is caused by malformed CSV headers or
   unsupported file types.

For further assistance see the comments in the source code which explain each
utility function and component.

## Changelog

### v1.0.0

- Initial release with basic statistics, charting and export functionality.

### v1.1.0

- Added inter-device Bland-Altman analysis with pivot tables and comparison
  exports.
- Introduced extensive documentation and example advanced utilities.

### v1.2.0 (planned)

- Implement Westgard multi-rule QC monitoring using functions in
  `advancedStats.js`.
- Support for storing recent sessions in local storage so users can revisit
  previous analyses.
- Option to compare different analytes within the same dataset.

### v1.3.0 (planned)

- Add dark mode toggle in the navigation bar.
- Accessibility improvements and keyboard navigation support.
- More export options including Excel format and summary dashboards.

### v1.4.0 (ideas)

- Integration with cloud storage providers for optional upload and sharing.
- Automated statistical tests for linearity and method comparison.
- Configurable thresholds for CV% warnings based on analyte type.
- Full localisation support for non-English users.
\nExtra line for total count
