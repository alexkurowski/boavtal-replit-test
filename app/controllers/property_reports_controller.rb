class PropertyReportsController < ApplicationController
  def index
    @property = Property.find(params[:property_id])
    @court    = Court.find(@property.data['court']['court'])

    ## TODO - import from incoming order

    @husband_name = 'John Smith'
    @husband_ssn  = '19920101-1234'
    @wife_name    = 'Mary Smith'
    @wife_ssn     = '19950101-4321'

    ## END TODO

    @assets = @property.data['assets'].flat_map do |asset_type, assets| # mapping through {isk: {...}, funds: {...}, ...}
                assets.values.map { |asset| PropertyAsset.new(data_hash: asset, asset_type: asset_type).extend(class_name_for asset_type) }
              end

    known_asset_types.each do |type|
      instance_variable_set("@#{type}_assets", select_assets(type))
    end

    # byebug

    render  pdf:        "property_report",
            encoding:   'UTF-8',
            layout:     'property_pdf.html.slim',
            template:   'info/property_reports/index',
            header:    { right: '[page] of [topage]' }
  end


    private


      def class_name_for(asset_type)
        "#{asset_type.capitalize}Asset".constantize
      end

      def known_asset_types
        # [ :realestate, :apartment, :bank, :funds, ... ]
        @assets.map { |asset| asset.asset_type }.uniq
      end

      def select_assets(type)
        @assets.select { |asset| asset.type_is?(type.to_s) }
      end

end
