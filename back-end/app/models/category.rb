class Category < ActiveRecord::Base
    has_many :task
end