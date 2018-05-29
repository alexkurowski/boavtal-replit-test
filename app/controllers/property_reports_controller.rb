class PropertyReportsController < ApplicationController
  def index
    @property = Property.find(params[:property_id])
    @court    = Court.find(@property.data['court']['court'])

    ## TODO

    @husband_name = 'John Smith'
    @husband_ssn  = '19920101-1234'
    @wife_name    = 'Mary Smith'
    @wife_ssn     = '19950101-4321'

    ## END TODO

    render  pdf:        "property_report",
            encoding:   'UTF-8',
            layout:     'property_pdf.html.slim',
            template:   'info/property_reports/index',
            header: { right: '[page] of [topage]' }
  end
end
