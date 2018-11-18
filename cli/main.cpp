#include <iostream>
#include <ctime>
#include <uuid/uuid.h>
#include <string>
#include <stdlib.h>
#include <list>
#include <nlohmann/json.hpp>
#include <iostream>
#include <fstream>
#include <curlpp/cURLpp.hpp>
#include <curlpp/Options.hpp>
#include <curlpp/Easy.hpp>
#include <boost/program_options.hpp>
#include <sstream>

using json = nlohmann::json;
using namespace curlpp::options;
using namespace std;
namespace po = boost::program_options;

const string baseUrl = "localhost:9000";

string login(string email, string password);

struct todo
{
    string id;
    string name;
    bool done;
    int priority;
    struct tm date;
    string category;
    struct tm reminder;

    string comment;
    struct tm created;
    struct tm timestamp;
    struct tm serverTimestamp;
};

struct todo createTodo(string name)
{
    struct todo ret;
    ret.name = name;

    uuid_t uuid;
    uuid_generate_random(uuid);
    char str[36];
    uuid_unparse(uuid, str);
    ret.id = string(str);

    return ret;
}

void to_json(json &j, const todo &t)
{
    j = json{{"name", t.name}, {"id", t.id}};
}

void from_json(const json &j, todo &t)
{
    j.at("name").get_to(t.name);
    j.at("id").get_to(t.id);
}

int main(int ac, char *av[])
{
    po::options_description desc("Allowed options");
    desc.add_options()("help", "Produce help message")
        ("login", "Login to todo website")
        ("sync", "Syncronize todos")
        ("todos", po::value<std::vector<std::string>>(), "Add todos");

    po::positional_options_description p;
    p.add("todos", -1);

    po::variables_map vm;
    po::store(po::command_line_parser(ac, av).
          options(desc).positional(p).run(), vm);
    po::notify(vm);


    json config;
    ifstream i("config.json");
    i >> config;


    if (vm.count("help"))
    {
        std::cout << desc << "\n";
        return 1;
    }
    if (vm.count("login"))
    {
        cout << "Logging in...\n";
        string email;
        string password;

        cout << "Email:";
        cin >> email;
        cout << "Password:";
        cin >> password;
        string token = login(email, password);
        config["token"] = token;
        ofstream o("config.json");
        o << config;
    }
    if (vm.count("todos"))
    {
        cout << "Todos:" << vm["todos"].as<vector<string>>().size() << "\n";
    }

    json j{
        {"name", "test2"},
        {"id", "123456"}};

    struct todo todo1 = createTodo("test");
    struct todo todo2 = j;

    list<struct todo> todos;
    todos.push_back(todo1);
    todos.push_back(j);
    for (struct todo const i : todos)
    {
        cout << i.id << ":" << i.name << "\n";
    }

    json j2 = {
        {"pi", 3.141},
        {"happy", true},
        {"name", "Niels"},
        {"nothing", nullptr},
        {"answer", {{"everything", 42}}},
        {"list", {1, 0, 2}},
        {"object", {{"currency", "USD"}, {"value", 42.99}}}};
    std::cout << j2["pi"] << "\n";
}

string login(string email, string pw) {
    try
    {
        json content = {
            {"email", email},
            {"password", pw},
            {"rememberMe", true}
        };

        string body = content.dump();

        std::stringstream ss;
        ss << baseUrl << "/api/v1/login/signIn";
        curlpp::Cleanup myCleanup;
        curlpp::Easy myRequest;
        
        myRequest.setOpt<Url>(ss.str());
        std::list<std::string> header;
        header.push_back("Content-Type: application/json");
        myRequest.setOpt(new HttpHeader(header));
        myRequest.setOpt(new PostFields(body));
        myRequest.setOpt(new PostFieldSize(body.size()));

        ostringstream os;
        os << myRequest;
        json response = json::parse(os.str());
        return response["token"];
    }
    catch (curlpp::RuntimeError &e)
    {
        std::cout << e.what() << std::endl;
        throw logic_error("Error!");
    }
    catch (curlpp::LogicError &e)
    {
        std::cout << e.what() << std::endl;
        throw logic_error("Error!");
    }
    throw logic_error("Error!");
}

void doRequest() {
    try
    {
        // That's all that is needed to do cleanup of used resources (RAII style).
        curlpp::Cleanup myCleanup;

        // Our request to be sent.
        curlpp::Easy myRequest;

        // Set the URL.
        myRequest.setOpt<Url>("http://example.com");

        // Send request and get a result.
        // By default the result goes to standard output.
        myRequest.perform();
    }
    catch (curlpp::RuntimeError &e)
    {
        std::cout << e.what() << std::endl;
    }

    catch (curlpp::LogicError &e)
    {
        std::cout << e.what() << std::endl;
    }
}