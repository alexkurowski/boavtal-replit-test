class PropertyDebt < PropertyAsset
  def debt_type
    return @asset_type
  end

  def percentage_share_owed_by(member, output, timeframe)
    num = (timeframe == :now) ? @data["#{member}_owe"].to_f : @data["#{member}_after"].to_f
    num = (num / 100) if output == :decimal
    output == :whole ? num.to_i : num
  end

  def owed_now_by?(member)
    percentage_share_owed_by(member, :whole, :now) > 0
  end

  def owed_after_by?(member)
    percentage_share_owed_by(member, :whole, :after) > 0
  end

  def bank_name
    @data['bank']
  end

  def account_number
    @data['number']
  end

  def owner
    @data['owner']
  end

  def due_date
    @data['date']
  end

  def total_value
    @data['amount'].to_i
  end

  def total_value_for(member, timeframe)
    percentage_share_owed_by(member, :decimal, timeframe) * total_value
  end
end
