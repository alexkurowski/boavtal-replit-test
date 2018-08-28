class Customer < ApplicationRecord
  # Include default devise modules. Others available are:
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :trackable,
         :recoverable, :rememberable, :validatable,
         :confirmable

  has_many :properties

  def self.allow_unconfirmed_access_for
    1.day
  end
end
