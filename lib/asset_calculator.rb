class AssetCalculator

  attr_reader :assets

  def initialize(args)
    @assets = args[:assets]
  end


  def all_assets_for(member)
    @assets.select {|a| a.data_hash.fetch("#{member}_own").to_i > 0}
  end

  def total_asset_amount_for(member)
    all_assets_for(member).map { |asset| asset.total_value_for(member) }.reduce(0, :+)
  end

end
