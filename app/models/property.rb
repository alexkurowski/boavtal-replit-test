class Property < ApplicationRecord
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

  def witness_to_sign?
    witness_to_sign = data['witnesses']['to_sign']
    true if witness_to_sign == 'true'
  end
end
