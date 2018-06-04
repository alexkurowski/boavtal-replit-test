module PropertyReportsHelper

  def show_member_name(member)
     member == :husband ? @husband_name : @wife_name
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

  def exists_and_owned_by?(asset_array, member)
    asset_array.present? && asset_array.each { |asset| true if asset.owned_now_by?(member) }
  end

  def to_sk(number)
    "#{number_to_currency(number, locale: :sv)}"
  end

  def to_rounded_sk(number)
    "#{number_to_currency(number, locale: :sv, unit: '', precision: 0)}"
  end

end
