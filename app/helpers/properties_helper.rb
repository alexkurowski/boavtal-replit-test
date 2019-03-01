module PropertiesHelper
  def property_panel type, opts = {}, &block
    """
    <div class='panel panel-bordered #{opts.dig :panel, :class}'>
      <div class='panel-heading #{opts.dig :heading, :class}'>
        <div class='h1 panel-title mt-40 mt-sm-80 mb-20 text-center font-weight-600'>
          #{ I18n.t "property.#{type}.header" }
        </div>
      </div>
      <div class='panel-body #{opts.dig :body, :class}'>
        #{ capture &block }
      </div>
    </div>
    """.html_safe
  end

  def property_member_years
    ( (Date.today.year - 100)..(Date.today.year - 12) )
      .map { |year| [year, year] }
  end

  def property_member_months
    I18n.t('date.month_names', locale: :sv)
      .compact
      .each_with_index
      .map { |month, index| ["#{month} (#{index + 1})", index + 1] }
  end

  def property_member_days
    ( 1..31 )
      .map { |day| [day, day] }
  end

  def property_number_of_copies
    recommended = 4
    ( 2..10 )
      .map { |n|
        if n == recommended
        then ["#{n} (#{t 'property.copies.copies_recommended'})", n]
        else [n, n]
        end
      }
  end

  def prop_type_match type, tab
    type.to_s == tab.to_s
  end

  def hidden_unless data_value
    'display: none;' unless data_value == 'true'
  end

  def hidden_unless_in data_value, true_options
    'display: none;' unless true_options.include? data_value
  end

  def asset_partial id = nil, type = ''
    render partial: "properties/form/assets_and_debts/asset",
      locals: {
        id: id || Time.now.to_i.to_s,
        type: type
      }
  end

  def debt_partial id = nil, type = ''
    render partial: "properties/form/assets_and_debts/debt",
      locals: {
        id: id || Time.now.to_i.to_s,
        type: type
      }
  end

  def faq_section key
    render partial: 'properties/faq',
      locals: {
        faq: key
      }
  end
end
