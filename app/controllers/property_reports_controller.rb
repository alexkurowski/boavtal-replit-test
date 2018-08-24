class PropertyReportsController < ApplicationController
  def index
    @property = Property.find(params[:property_id])

    redirect_if_incomplete and return

    @court    = Court.find(@property.data['court']['court'])
    @assets = @property.data['assets']&.flat_map do |asset_type, assets| # mapping through {isk: {...}, funds: {...}, ...}
                assets.values.map { |asset| PropertyAsset.new(data_hash: asset, asset_type: asset_type).extend(class_name_for asset_type) }
              end

    @debts = @property.data['debts']&.flat_map do |debt_type, debts|
                debts.values.map { |debt| PropertyDebt.new(data_hash: debt, asset_type: debt_type).extend(DebtModule) }
              end

    @asset_calculator = AssetAndDebtCalculator.new(assets: @assets, debts: @debts)

    known_types(@assets).each do |type|
      instance_variable_set("@#{type}_assets", select_assets_or_debts(@assets, type))
    end if @assets.present?

    known_types(@debts).each do |type|
      instance_variable_set("@#{type}_debts", select_assets_or_debts(@debts, type))
    end if @debts.present?


    render  pdf:        "property_report",
            encoding:   'UTF-8',
            layout:     'property_pdf.html.slim',
            template:   'info/property_reports/index',
            page_offset: -1,
            cover:       render_to_string('info/property_reports/cover.pdf.slim'),
            margin:     { bottom: 30, top: 10 },
            dpi:         '300',
            header:     {
                          spacing: 20
                        },
            footer:     {
                          left: 'Sida [page]/[topage]',
                          spacing: 10,
                          html: { template: 'info/property_reports/files/footer.html.slim' }
                        }
  end


    private


      def class_name_for(asset_type)
        "#{asset_type.capitalize}Asset".constantize
      end

      def known_types(collection)
        # [ :realestate, :apartment, :bank, :funds, ... ]
        collection.map { |asset| asset.asset_type }.uniq
      end

      def select_assets_or_debts(collection, type)
        collection.select { |asset| asset.type_is?(type.to_s) }
      end

      def redirect_if_incomplete
        unless @property.validated?
          redirect_to properties_path, flash: { notice: 'You need to complete the form first.' }
        end
      end

end
