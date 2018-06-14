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

  def compensate_by_law?
    compensation = data['compensation']['decide']
    true if compensation == 'false'
  end

  def witness_to_sign?
    witness_to_sign = data['witnesses']['to_sign']
    true if witness_to_sign == 'true'
  end
end
