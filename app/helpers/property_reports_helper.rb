module PropertyReportsHelper
  def case_number_filled_out?
    @property.data['court']['case_number'] != 'T-'
  end

  def get_case_number
    @property.data['court']['case_number']
  end
end
