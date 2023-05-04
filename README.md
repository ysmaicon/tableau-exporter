# Angular Tableau Exporter Project

This Angular project embeds a Tableau dashboard into a web application and allows users to export the dashboard data in various formats, including CSV, Excel, Image, PowerPoint, PDF, and raw data.

The Tableau JavaScript API is used to embed the dashboard and export the data. However, the CSV and Excel export methods of the API have different signatures that require the user to click on a dashboard sheet instead of having a dialog box like the other export methods. To solve this problem, this project implements specific functions that use the API methods to scan all dashboard sheets, correctly format the data, and process it.

When the export button is clicked, a file is generated and made available for download in the selected format. For CSV and Excel formats, a zip file is generated containing one file for each dashboard sheet (CSV) or one tab for each sheet (Excel).


## Running the Application

1. Clone this repository:

    `git clone https://github.com/SEU-USUARIO-GIT/tableau-exporter.git`

1. Install the Angular CLI:

    `npm install -g @angular/cli`

1. Install project dependencies: 

    `npm install`

1. Start the development server:

    `ng serve -o`


## References

- [GitHub repository for Export to Excel](https://github.com/alexlokhov/export-to-excel/blob/master/xlsx_exporter.html)
- [Tableau JavaScript API documentation](https://help.tableau.com/current/api/js_api/en-us/JavaScriptAPI/js_api_ref.htm)
