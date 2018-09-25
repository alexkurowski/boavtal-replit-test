module PropertyReportsHelper

  def show_member_name(member)
    @property.full_name_for(member)
  end

  def show_ssn_for(member)
    # member == :husband ? @property.data['husband']['ssn2'] : @property.data['wife']['ssn2']
    @property.data[member.to_s]['datebirth']['1i'] +
    add_zero(@property.data[member.to_s]['datebirth']['2i']) +
    add_zero(@property.data[member.to_s]['datebirth']['3i']) + '-' +
    @property.data[member.to_s]['ssn2']
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

  def calculate_bodelningslikvid(member)
    if @property.property_compensation == 'true' && @property.compensation_amount > 0 && @property.compensation_reciever == member
      @property.compensation_amount
    elsif @property.property_compensation == 'false' && @property.total_difference_to_pay > 0 && @property.receiving_spouse == member
      @property.total_difference_to_pay
    elsif @property.property_compensation == 'true' && @property.compensation_amount > 0 && @property.compensation_reciever != member
      -@bodelningslikvid = @property.compensation_amount
    elsif @property.property_compensation == 'false' && @property.total_difference_to_pay > 0 && @property.giving_spouse == member
      -@property.total_difference_to_pay
    else
      0
    end
  end

  def add_bodelning_if_positive
    @bodelningslikvid > 0 ? @bodelningslikvid : 0
  end

  def sub_bodelning_if_negative
    @bodelningslikvid < 0 ? @bodelningslikvid : 0
  end

  def to_sk(number)
    "#{number_to_currency(number, locale: :sv)}"
  end

  def to_rounded_sk(number)
    "#{number_to_currency(number, locale: :sv, unit: '', precision: 0)}"
  end

  def total_difference_to_pay # AKA "FINAL HEADFUCK NUMBER"
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

    private

      def add_zero(num)
        num.to_i < 10 ? "0#{num}" : num
      end

end
