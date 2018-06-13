class AssetAndDebtCalculator

  attr_reader :assets, :debts

  def initialize(args)
    @assets = args[:assets]
    @debts  = args[:debts]
  end


  def all_assets_for(member)
    @assets.select {|a| a.data_hash.fetch("#{member}_own").to_i > 0} if @assets.present?
  end

  def all_debts_for(member)
    @debts.select {|a| a.data_hash.fetch("#{member}_owe").to_i > 0} if @debts.present?
  end

  def all_transitory_assets_for(member)
    @assets.select {|a| a.data_hash.fetch("#{member}_after").to_i > 0} if @assets.present?
  end

  def all_transitory_debts_for(member)
    @debts.select {|a| a.data_hash.fetch("#{member}_after").to_i > 0} if @debts.present?
  end

  def total_debt_amount_for(member, timeframe)
    if debts_exist_for? member
      all_debts_for(member).map { |debt| debt.total_value_for(member, timeframe) }.reduce(0, :+)
    else
      0
    end
  end

  def assets_exist_for?(member)
    !all_assets_for(member).blank?
  end

  def debts_exist_for?(member)
    !all_debts_for(member).blank?
  end

  def transitory_assets_exist_for?(member)
    !all_transitory_assets_for(member).blank?
  end

  def transitory_debts_exist_for?(member)
    !all_transitory_debts_for(member).blank?
  end

  def total_transitory_asset_amount_for(member, timeframe)
    if transitory_assets_exist_for?(member)
      all_transitory_assets_for(member).map { |asset| asset.total_value_for(member, timeframe) }.reduce(0, :+)
    else
      0
    end
  end

  def total_asset_amount_for(member, timeframe)
    if assets_exist_for?(member)
      all_assets_for(member).map { |asset| asset.total_value_for(member, timeframe) }.reduce(0, :+)
    else
      0
    end
  end

  def net_worth_for(member, timeframe)
    net_worth = total_asset_amount_for(member, timeframe) - total_debt_amount_for(member, timeframe)

    net_worth < 0 ? 0 : net_worth
  end

  def cumulative_net_worth(timeframe)
    net_worth_for(:husband, timeframe) + net_worth_for(:wife, timeframe)
  end

  def divided_net_worth(timeframe)
    cumulative_net_worth(timeframe) / 2
  end

end
