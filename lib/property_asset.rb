class PropertyAsset

  attr_reader :data_hash

  def initialize(args)
    @data_hash  = args[:data_hash]

    @data       = asset_data
    @asset_type = asset_type
  end

  def type_is?(type)
    type == asset_type
  end

  def percentage_share_owned_now_by(member)
    @data["#{member}_own"].to_f
  end

  def owned_now_by?(member)
    percentage_share_owned_now_by(member) > 0
  end

  def market_value # Marknadsvärde
    @data['marketvalue'].to_i
  end

  def value_share_of(member)
    market_value - market_value * (percentage_share_owned_now_by(member) / 100)
  end

    private

      def asset_type
        @data_hash[0]
      end

      def asset_data
        @data_hash[1].values[0]
      end

end



module RealestateAsset
  def city
    @data['city']
  end

  def name
    @data['name']
  end
end

module ApartmentAsset
  def apartment_number
    @data['number']
  end

  def zip
    @data['zip']
  end

  def city
    @data['ort']
  end

  def address
    @data['address']
  end

  def housing_cooperative
    @data['name']
  end
end
