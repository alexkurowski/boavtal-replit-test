module PropertyParamsCleanup
  def property_params_cleanup
    unless params.dig(:property, :data, :compensation, :decide) == 'true'
      params[:property][:data].delete :payment
    end

    if params.dig(:property, :data, :compensation, :decide) == 'none'
      params[:property][:data].delete :payment_details
    end

    unless params.dig(:property, :data, :assets).blank?
      params.dig(:property, :data, :assets).each do |type, value|
        params[:property][:data][:assets][type].delete :template
      end
    end

    unless params.dig(:property, :data, :debts).blank?
      params.dig(:property, :data, :debts).each do |type, value|
        params[:property][:data][:debts][type].delete :template
      end
    end

    unless params.dig(:property, :data, :court, :case_number).blank?
      params[:property][:data][:court][:case_number].insert(0, 'T') unless params[:property][:data][:court][:case_number][0] == 'T'
      params[:property][:data][:court][:case_number].insert(1, '-') unless params[:property][:data][:court][:case_number][1] == '-'
    end

    case params[:submit_type]
    when 'soft' then params[:property][:validated] = false
    when 'hard' then params[:property][:validated] = true
    end
  end
end
