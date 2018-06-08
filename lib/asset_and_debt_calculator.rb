class AssetAndDebtCalculator

  attr_reader :assets, :debts

  def initialize(args)
    @assets = args[:assets]
    @debts  = args[:debts]
  end


  def all_assets_for(member)
    @assets.select {|a| a.data_hash.fetch("#{member}_own").to_i > 0}
  end

  def all_debts_for(member)
    @debts.select {|a| a.data_hash.fetch("#{member}_owe").to_i > 0}
  end

  def total_asset_amount_for(member)
    all_assets_for(member).map { |asset| asset.total_value_for(member) }.reduce(0, :+)
  end

  def total_debt_amount_for(member)
    all_debts_for(member).map { |debt| debt.total_value_for(member) }.reduce(0, :+)
  end

  def assets_exist_for?(member)
    !all_assets_for(member).blank?
  end

  def debts_exist_for?(member)
    !all_debts_for(member).blank?
  end

end
