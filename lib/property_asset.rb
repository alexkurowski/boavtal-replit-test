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

  def percentage_share_owned_now_by(member, output)
    num = @data["#{member}_own"].to_f
    num = (num / 100) if output == :decimal
    output == :whole ? num.to_i : num
  end

  def owned_now_by?(member)
    percentage_share_owned_now_by(member, :whole) > 0
  end

  def market_value # Marknadsvärde
    @data['marketvalue'].to_f
  end

  def get_float_for(cost)
    @data[cost].to_f
  end

  def get_int_for(cost)
    @data[cost].to_i
  end

  def value_share_of(member)
    market_value - market_value * (percentage_share_owned_now_by(member, :whole) / 100)
  end

  def asset_type
    @data_hash[0]
  end

    private

      def asset_data
        @data_hash[1].values[0]
      end

end


module MonetaryAssetHelper
  def total_value
    @data['total'].to_i
  end

  def account_number
    @data['account']
  end

  def bank_name
    @data['bank']
  end
end


module BankAsset
  include MonetaryAssetHelper
end

module FundsAsset
  include MonetaryAssetHelper
end


module RealestateAsset
  def city
    @data['city']
  end

  def name
    @data['name']
  end

  def calc_capital_gains
    market_value                      -
    get_float_for('purchaseprice')    -
    get_float_for('acquisitioncost')  -
    get_float_for('agentfee')         -
    get_float_for('improvementcost')  +
    get_float_for('deferral')
  end

  def calc_capital_gains_tax
    # Capital gains tax = Capital gains * .22

    calc_capital_gains * 0.22
  end

  def calc_net_value
    # NET VALUE = Market value - Capital gains tax - Real estate agent fee

    market_value - calc_capital_gains_tax - get_float_for('agentfee')
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

  def calc_capital_gains
    market_value                      -
    get_float_for('purchaseprice')    -
    get_float_for('agentfee')         -
    get_float_for('salescosts')       -
    get_float_for('improvementcost')  -
    get_float_for('capitalinjection') +
    get_float_for('salefunds')        +
    get_float_for('purchasefunds')    +
    get_float_for('deferral')
  end

  def calc_capital_gains_tax
    # Capital gains tax = Capital gains * .22

    calc_capital_gains * 0.22
  end

  def calc_net_value
    # NET VALUE = Market value - Capital gains tax - Real estate agent fee

    market_value - calc_capital_gains_tax - get_float_for('agentfee')
  end
end
