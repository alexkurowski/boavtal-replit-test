module PropertyReportsHelper

  def show_member_name(member)
    member == :husband ? @property.full_name_for(:husband) : @property.full_name_for(:wife)
  end

  def show_ssn_for(member)
    member == :husband ? @property.data['husband']['ssn2'] : @property.data['wife']['ssn2']
  end

  def case_number_filled_out?
    @property.data['court']['case_number'] != 'T-'
  end

  def get_case_number
    @property.data['court']['case_number']
  end

  def get_registration_date
    @property.data['court']['registration_date']
  end

  def any_debts?
    @property.data['assets_debts']['any_debts'] == 'true' ? true : false
  end

  def any_assets?
    @property.data['assets_debts']['any_assets'] == 'true' ? true : false
  end

  def exists_and_owned_by?(*variable_array, member, timeframe) # timeframe can either be :NOW or :AFTER
    array_without_nils = variable_array.compact.flatten
    return false if array_without_nils.empty?
    if timeframe == :now
      array_without_nils.map { |asset| asset.owned_now_by?(member) }.any?
    elsif timeframe == :after
      array_without_nils.map { |asset| asset.owned_after_by?(member) }.any?
    end
  end

  def to_sk(number)
    "#{number_to_currency(number, locale: :sv)}"
  end

  def to_rounded_sk(number)
    "#{number_to_currency(number, locale: :sv, unit: '', precision: 0)}"
  end

  def total_difference_to_pay
    arr = [:husband, :wife].map { |member| @asset_calculator.divided_net_worth(:now) - @asset_calculator.transitory_net_worth_for(member, :after) }
    arr.uniq.count <= 1 ? 0 : arr.max
  end

  def giving_spouse
    h = {husband: @asset_calculator.transitory_net_worth_for(:husband, :after), wife: @asset_calculator.transitory_net_worth_for(:wife, :after)}
    h.key(h.values.max)
  end

  def receiving_spouse
    giving_spouse == :husband ? :wife : :husband
  end

end
