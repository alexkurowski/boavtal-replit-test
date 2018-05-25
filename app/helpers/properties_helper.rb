module PropertiesHelper
  def property_panel type, &block
    """
    <div class='panel panel-bordered'>
      <div class='panel-heading'>
        <h3 class='panel-title'>#{ I18n.t "property.#{type}.header" }</h3>
      </div>
      <div class='panel-body'>
        #{ capture &block }
      </div>
    </div>
    """.html_safe
  end

  def prop_type_match type, tab
    type.to_s == tab.to_s
  end

  def hidden_unless data_value
    'display: none;' unless data_value == 'true'
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
