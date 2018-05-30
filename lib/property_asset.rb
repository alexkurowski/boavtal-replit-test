class PropertyAsset

  attr_reader :data_hash

  def initialize(args)
    @data_hash  = args[:data_hash]

    @data       = asset_data
    @asset_type = asset_type
  end

  def real_estate?
    @asset_type == 'realestate'
  end

  def owned_now_by(member)
    @data["#{member}_own"].to_i
  end

    private

      def asset_type
        @data_hash[0]
      end

      def asset_data
        @data_hash[1].values[0]
      end

end
