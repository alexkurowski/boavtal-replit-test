class PropertyAsset

  attr_reader :data_hash, :asset_type

  def initialize(args)
    @data_hash  = args[:data_hash]
    @asset_type = args[:asset_type]

    @data       = asset_data
  end

  def type_is?(type)
    type == asset_type
  end

  def percentage_share_owned_by(member, output, timeframe)
    num = (timeframe == :now) ? @data["#{member}_own"].to_f : @data["#{member}_after"].to_f
    num = (num / 100) if output == :decimal
    output == :whole ? num.to_i : num
  end

  def maximum_allowed_percentage(timeframe)
    if timeframe == :now
      1
    else
      percentage_share_owned_by(:husband, :decimal, :now) + percentage_share_owned_by(:wife, :decimal, :now)
    end
  end

  def owned_now_by?(member)
    percentage_share_owned_by(member, :whole, :now) > 0
  end

  def owned_after_by?(member)
    percentage_share_owned_by(member, :whole, :after) > 0
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
    market_value - market_value * (percentage_share_owned_by(member, :whole, :now) / 100)
  end

  # def asset_type
  #   @asset_type
  # end

    private

      def asset_data
        @data_hash
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

  def total_value_for(member, timeframe)
    percentage_share_owned_by(member, :decimal, timeframe) * (total_value * maximum_allowed_percentage(timeframe))
  end
end


module FundsAsset
  include MonetaryAssetHelper

  def calc_capital_gains
    capital_gains = get_float_for('salesprice') - get_float_for('costamount')
    capital_gains < 0 ? 0 : capital_gains
  end

  def calc_capital_gains_tax
    calc_capital_gains * 0.3
  end

  def calc_net_value
    get_float_for('salesprice') - calc_capital_gains_tax
  end

  def total_value_for(member, timeframe)
    percentage_share_owned_by(member, :decimal, timeframe) * (calc_net_value * maximum_allowed_percentage(timeframe))
  end
end

module SecurityAsset
  include MonetaryAssetHelper

  def calc_capital_gains
    capital_gains = get_float_for('salesprice') - get_float_for('costamount')
    capital_gains < 0 ? 0 : capital_gains
  end

  def calc_capital_gains_tax
    calc_capital_gains * 0.3
  end

  def calc_net_value
    get_float_for('salesprice') - calc_capital_gains_tax
  end

  def total_value_for(member, timeframe)
    percentage_share_owned_by(member, :decimal, timeframe) * (calc_net_value * maximum_allowed_percentage(timeframe))
  end
end


module IskAsset
  include MonetaryAssetHelper

  def total_value_for(member, timeframe)
    percentage_share_owned_by(member, :decimal, timeframe) * (total_value * maximum_allowed_percentage(timeframe))
  end
end


module InsuranceAsset
  include MonetaryAssetHelper

  def total_value_for(member, timeframe)
    percentage_share_owned_by(member, :decimal, timeframe) * (total_value * maximum_allowed_percentage(timeframe))
  end
end

module OtherAsset
  def name
    @data['name']
  end

  def total_value
    @data['total'].to_i
  end

  def total_value_for(member, timeframe)
    percentage_share_owned_by(member, :decimal, timeframe) * (total_value * maximum_allowed_percentage(timeframe))
  end
end

module RealestateAsset
  def city
    @data['city']
  end

  def name
    @data['name']
  end

  def calc_capital_gains
    capital_gains = market_value                      -
                    get_float_for('purchaseprice')    -
                    get_float_for('acquisitioncost')  -
                    get_float_for('agentfee')         -
                    get_float_for('improvementcost')  +
                    get_float_for('deferral')

    capital_gains < 0 ? 0 : capital_gains
  end

  def calc_capital_gains_tax
    calc_capital_gains * 0.22
  end

  def calc_net_value
    market_value - calc_capital_gains_tax - get_float_for('agentfee')
  end

  def total_value_for(member, timeframe)
    percentage_share_owned_by(member, :decimal, timeframe) * (calc_net_value * maximum_allowed_percentage(timeframe))
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
    capital_gains = market_value                      -
                    get_float_for('purchaseprice')    -
                    get_float_for('agentfee')         -
                    get_float_for('salescosts')       -
                    get_float_for('improvementcost')  -
                    get_float_for('capitalinjection') -
                    get_float_for('salefunds')        +
                    get_float_for('purchasefunds')    +
                    get_float_for('deferral')

    capital_gains < 0 ? 0 : capital_gains
  end

  def calc_capital_gains_tax
    calc_capital_gains * 0.22
  end

  def calc_net_value
    market_value - calc_capital_gains_tax - get_float_for('agentfee')
  end

  def total_value_for(member, timeframe)
    percentage_share_owned_by(member, :decimal, timeframe) * (calc_net_value * maximum_allowed_percentage(timeframe))
  end
end


module CarAsset
  def reg_number
    @data['registrationnumber']
  end

  def total_value
    @data['value'].to_i
  end

  def total_value_for(member, timeframe)
    percentage_share_owned_by(member, :decimal, timeframe) * (total_value * maximum_allowed_percentage(timeframe))
  end
end

module DebtModule
end
