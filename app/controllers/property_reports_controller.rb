class PropertyReportsController < ApplicationController
  def index
    @property_form = Property.find(params[:property_id])

    render  pdf:        "property_report",
            encoding:   'UTF-8',
            layout:     'property_pdf.html.slim',
            template:   'info/property_reports/index',
            header: { right: '[page] of [topage]' }
  end
end
