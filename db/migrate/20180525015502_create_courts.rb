class CreateCourts < ActiveRecord::Migration[5.0]
  def up
    create_table :courts do |t|
      t.string :name
      t.string :address
      t.string :fax
      t.string :tel
      t.string :email
      t.string :bank_details
      t.string :box

      t.timestamps
    end

    seed_file = File.join(Rails.root, 'db', 'seeds', 'courts.rb')
    if File.exists? seed_file
      Court.delete_all
      puts "   -> Seeding..."
      load(seed_file)
    end
  end

  def down
    drop_table :courts
  end
end
