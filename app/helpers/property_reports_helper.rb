module PropertyReportsHelper
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

end
