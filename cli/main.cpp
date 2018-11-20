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
#include <regex>
#include <chrono>
#include <ctime>
#include <iomanip>
#include <algorithm> 
#include <cctype>
#include <locale>

#include "rest.cpp"
#include "todoutil.cpp"

using json = nlohmann::json;
using namespace curlpp::options;
using namespace std;
namespace po = boost::program_options;

json config;

json todos;

json deleted;

string configFile = "/home/hoff/.todo/config.json";

int main(int ac, char *av[])
{
    po::options_description desc("Allowed options");
    desc.add_options()("help", "Produce help message")
        ("login,l", "Login to todo website")
        ("sync,s", "Syncronize todos")
        ("todos", po::value<vector<string>>(), "Add todos")
        ("baseUrl", po::value<string>(), "Change the baseUrl")
        ("toggle,t", po::value<string>(), "Toggle a todo")
        ("delete,d", po::value<string>(), "Delete a todo");

    po::positional_options_description p;
    p.add("todos", -1);

    po::variables_map vm;
    po::store(po::command_line_parser(ac, av).options(desc).positional(p).run(), vm);
    po::notify(vm);

    ifstream i(configFile);
    i >> config;

    ifstream todoFile(config["jsonFile"].get<string>());
    todoFile >> todos;

    ifstream deleteFile(config["deleteFile"].get<string>());
    deleteFile >> deleted;

    if (vm.count("help"))
    {
        std::cout << desc << "\n";
        return 1;
    }
    if (vm.count("baseUrl")) {
        config["baseUrl"] = vm["baseUrl"].as<string>();
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
        string token = login(email, password, config);
        config["token"] = token;
    }
    if (vm.count("sync"))
    {
        if (config["token"] == nullptr)
        {
            cout << "Please log in with --login before syncing your todos\n";
            return -1;
        }
        todos = syncTodos(deleted, config, todos);
        deleted = json::array();
    }
    if (vm.count("todos"))
    {
        std::stringstream ss;
        for (string const input : vm["todos"].as<vector<string>>())
        {
            ss << input << " ";
        }
        json todo = parseTodo(ss.str());
        todos.push_back(todo);
    }
    if (vm.count("toggle")) {
        string toggled = vm["toggle"].as<string>();
        for (int i = 0; i < todos.size(); i++)
        {
            json todo = todos.at(i);
            if(todo["name"].get<string>().find(toggled) != string::npos) {
                todos.at(i)["done"] = !(todos.at(i)["done"].get<bool>());
                todos.at(i)["timestamp"] = currentTime();
            }
        }
    }
    if (vm.count("delete")) {
        string toDelete = vm["delete"].as<string>();
        json newTodos = json::array();
        for (int i = 0; i < todos.size(); i++)
        {
            json todo = todos.at(i);
            if(todo["name"].get<string>().find(toDelete) != string::npos) {
                if(todo["serverTimestamp"] != nullptr) {
                    deleted.push_back(todo["id"]);
                }
            } else {
                newTodos.push_back(todo);
            }
        }
        todos = newTodos;
    }
    list<json> todosList;
    for (json const i : todos)
    {
        todosList.push_back(i);
    }
    todosList.sort(compare_todo);
    for (json const i : todosList)
    {
        cout << prettyTodo(i) << "\n";
    }
    if (vm.count("sync"))
    {
        todos = syncTodos(deleted, config, todos);
        deleted = json::array();
    }

    ofstream o(config["jsonFile"].get<string>());
    o << todos.dump(4);

    ofstream d(config["deleteFile"].get<string>());
    d << deleted.dump(4);

    ofstream c(configFile);
    c << config.dump(4);
}
