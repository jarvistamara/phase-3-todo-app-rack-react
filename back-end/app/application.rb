require 'pry'
require 'json'

class Application

  def call(env)
    resp = Rack::Response.new
    req = Rack::Request.new(env)

    if req.path.match(/task/) && req.get?

      tasks = Task.all.map do |task|
        {id: task.id, text: task.text, category: task.category.name}
      end

      return [200, { 'Content-Type' => 'application/json' }, [ {:tasks => task}.to_json ]]

    elsif req.path.match(/tasks/) && req.post?

      data = JSON.parse req.body.read
      category = Category.where(name: data["category"])
      task = Task.create(text: data["text"], category: category)

      task_response = {id: task.id, text: task.text, category: task.category.name}
      return [200, { 'Content-Type' => 'application/json' }, [ {:tasks => task_response}.to_json ]]

    elsif req.delete?

      id = req.path.split("/task/").last
      Task.find(id).delete

      return [200, { 'Content-Type' => 'application/json' }, [ {:message => "Deleted Task"}.to_json ]]

    else
      resp.write "Path Not Found"

    end

    resp.finish
  end

end
