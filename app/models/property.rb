class Property < ApplicationRecord
  belongs_to :customer, optional: true

  def data *path
    if path.empty?
      self[:data]
    else
      self.send("data[#{ path.map(&:to_s).join('][') }]")
    end
  end

  def fetch *path, default
    self.send("data[#{ path.map(&:to_s).join('][') }]") || default
  end

  def method_missing method_sym, *opts
    method = method_sym.to_s

    if method.starts_with? 'data[' and method.ends_with? ']'
      path = method[5..-2].split ']['
      result = data.dig *path rescue nil
      return result
    end

    raise NoMethodError, "undefined method `#{method}` for #{self.class.name}"
  end

  def sorted property_type
    return {} if data(property_type).blank?

    data(property_type)
      .inject({}) do |result, (type, properties)|
        properties.each do |id, property|
          result[id] = property
          result[id]['type'] = type
        end
        result
      end
      .sort_by { |k, v| k }
      .to_h
  end

  def sorted_assets; sorted :assets end
  def sorted_debts;  sorted :debts  end

  def property_compensation
    data['compensation']['decide']
  end

  def compensation_amount
    data['payment']['how_much']
  end

  def compensation_reciever
    data['payment']['to_whom'].to_sym
  end

  def compensation_giver
    compensation_reciever == :husband ? :wife : :husband
  end

  def compensate_by_law?
    true if property_compensation == 'false'
  end

  def compensation_due_date
    data['payment_details']['date']
  end

  def compensation_clearing
    data.dig('payment_details', 'field_1')
  end

  def compensation_account
    data.dig('payment_details', 'field_2')
  end

  def compensation_bank_name
    data.dig('payment_details', 'field_3')
  end

  def compensation_details_filled?
    !compensation_clearing.blank? &&
    !compensation_account.blank?  &&
    !compensation_bank_name.blank?
  end

  def interest_before?
    data['interest']['before_payment'] == 'true'
  end

  def interest_after?
    data['interest']['after_payment'] == 'true'
  end

  def interest_rate_before
    data['interest']['before_payment_rate']
  end

  def interest_rate_after
    data['interest']['after_payment_rate']
  end

  def witness_to_sign?
    witness_to_sign = data['witnesses']['to_sign']
    true if witness_to_sign == 'true'
  end

  def validated? # remove if moving away from heroku
    validated
  end

  def full_name_for(member)
    "#{data[member.to_s]['firstname']} #{data[member.to_s]['lastname']}"
  end
end
