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

using json = nlohmann::json;
using namespace curlpp::options;
using namespace std;
namespace po = boost::program_options;

json config;

json todos;

string configFile = "/home/hoff/.todo/config.json";

string login(string email, string password);
void sync();

const int FG_BLACK = 30;
const int FG_RED = 31;
const int FG_GREEN = 32;
const int FG_YELLOW = 33;
const int FG_BLUE = 34;
const int FG_MAGENTA = 35;
const int FG_CYAN = 36;
const int FG_WHITE = 37;
const int BG_BLACK = 40;
const int BG_RED = 41;
const int BG_GREEN = 42;
const int BG_YELLOW = 43;
const int BG_BLUE = 44;
const int BG_MAGENTA = 45;
const int BG_CYAN = 46;
const int BG_WHITE = 47;
const int BOLD = 1;
const int UNDERLINE = 4;
const int INVERSE = 7;

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

string printPretty(string message, int options[], int oL)
{
    std::stringstream ss;
    ss << "\033[";
    for (int i = 0; i < oL; i++)
    {
        if (i > 0)
        {
            ss << ";";
        }
        ss << options[i];
    }
    ss << "m" << message << "\033[0m";
    return ss.str();
}

string printPretty(string message, int option)
{
    return printPretty(message, new int[1]{option}, 1);
}

string printPretty(string message, int option1, int option2)
{
    return printPretty(message, new int[2]{option1, option2}, 2);
}

string prettyPrio(int prio)
{
    switch (prio)
    {
    case 5:
        return printPretty("!5", FG_WHITE, BG_RED);
    case 4:
        return printPretty("!4", FG_WHITE, BG_MAGENTA);
    case 3:
        return printPretty("!3", FG_BLACK, BG_YELLOW);
    case 2:
        return printPretty("!2", FG_WHITE, BG_BLUE);
    case 1:
        return printPretty("!1", FG_WHITE, BG_GREEN);
    default:
        return "  ";
    }
}

string prettyTodo(json todo)
{
    std::stringstream ss;
    if (todo["priority"] != nullptr)
    {
        ss << prettyPrio(todo["priority"].get<int>());
    }
    else
    {
        ss << "  ";
    }

    if(todo["done"].get<bool>()) {
        ss << "  " << printPretty(todo["name"].get<string>(), UNDERLINE, FG_CYAN);
    } else {
        ss << "  " << todo["name"].get<string>();
    }

    if (todo["category"] != nullptr)
    {
        ss << "#" << todo["category"].get<string>();
    }

    return ss.str();
}

regex prioRegex("[!+]([1-5])", regex_constants::ECMAScript);
regex categoryRegex("[#:]([A-Za-z0-9]+)", regex_constants::ECMAScript);

string currentTime()
{
    auto now = chrono::system_clock::now();
    auto in_time_t = chrono::system_clock::to_time_t(now);

    std::stringstream ss;
    ss << put_time(localtime(&in_time_t), "%Y-%m-%d %X");
    return ss.str();
}

// trim from start (in place)
static inline void ltrim(std::string &s) {
    s.erase(s.begin(), std::find_if(s.begin(), s.end(), [](int ch) {
        return !std::isspace(ch);
    }));
}

// trim from end (in place)
static inline void rtrim(std::string &s) {
    s.erase(std::find_if(s.rbegin(), s.rend(), [](int ch) {
        return !std::isspace(ch);
    }).base(), s.end());
}

// trim from both ends (in place)
static void trim(std::string &s) {
    ltrim(s);
    rtrim(s);
}

json parseTodo(string input)
{
    json todo;

    uuid_t uuid;
    uuid_generate_random(uuid);
    char str[36];
    uuid_unparse(uuid, str);
    todo["id"] = string(str);

    std::stringstream name;
    regex_replace(ostreambuf_iterator<char>(name), input.begin(), input.end(), prioRegex, "");
    string input2 = name.str();
    std::stringstream name2;
    regex_replace(ostreambuf_iterator<char>(name2), input2.begin(), input2.end(), categoryRegex, "");

    smatch match;
    regex_search(input, match, prioRegex);
    if (match.size() > 0)
    {
        todo["priority"] = stoi(match[0]);
    }
    smatch match2;
    regex_search(input, match2, categoryRegex);
    if (match2.size() > 0)
    {
        todo["category"] = match2[1];
    }

    todo["timestamp"] = currentTime();
    todo["created"] = currentTime();
    todo["files"] = json::array();

    string todoName = name2.str();
    trim(todoName);
    todo["name"] = todoName;
    todo["done"] = false;

    return todo;
}

bool compare_todo(const json first, const json second)
{
    if(first["done"].get<bool>() != second["done"].get<bool>()) {
        return first["done"].get<bool>() < second["done"].get<bool>();
    }

    int prio1 = 0;
    if(first.find("priority") != first.end()) {
        prio1 = first["priority"].get<int>();
    }
    int prio2 = 0;
    if(second.find("priority") != second.end()) {
        prio2 = second["priority"].get<int>();
    }
    if(prio1 != prio2) {
        return prio1 > prio2;
    }
    return true;
}

int main(int ac, char *av[])
{
    printPretty("yay", new int[2]{31, 40}, 2);
    po::options_description desc("Allowed options");
    desc.add_options()("help", "Produce help message")
        ("login", "Login to todo website")
        ("sync", "Syncronize todos")
        ("todos", po::value<vector<string>>(), "Add todos")
        ("baseUrl", po::value<string>(), "Change the baseUrl")
        ("toggle", po::value<string>(), "Toggle a todo");

    po::positional_options_description p;
    p.add("todos", -1);

    po::variables_map vm;
    po::store(po::command_line_parser(ac, av).options(desc).positional(p).run(), vm);
    po::notify(vm);

    ifstream i(configFile);
    i >> config;

    ifstream todoFile(config["jsonFile"].get<string>());
    todoFile >> todos;

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
        ofstream o(configFile);
        o << config.dump(4);
    }
    if (vm.count("sync"))
    {
        if (config["token"] == nullptr)
        {
            cout << "Please log in with --login before syncing your todos\n";
            return -1;
        }
        sync();
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
        ofstream o(config["jsonFile"].get<string>());
        o << todos.dump(4);
    }
    if (vm.count("toggle")) {
        string toggled = vm["toggle"].as<string>();
        for (int i = 0; i < todos.size(); i++)
        {
            json todo = todos.at(i);
            if(todo["name"].get<string>().find(toggled) != string::npos) {
                todos.at(i)["done"] = !(todos.at(i)["done"].get<bool>());
            }
        }       
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
        sync();
    }
}

string login(string email, string pw)
{
    try
    {
        json content = {
            {"email", email},
            {"password", pw},
            {"rememberMe", true}};

        string body = content.dump();

        std::stringstream ss;
        ss << config["baseUrl"].get<string>() << "/api/v1/login/signIn";
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

void sync()
{
    try
    {
        string body = todos.dump();

        std::stringstream ss;
        ss << config["baseUrl"].get<string>() << "/api/v1/todo";
        curlpp::Cleanup myCleanup;
        curlpp::Easy myRequest;

        myRequest.setOpt<Url>(ss.str());
        std::list<std::string> header;
        header.push_back("Content-Type: application/json");
        std::stringstream auth;
        auth << "x-auth-token: " << config["token"].get<string>();
        header.push_back(auth.str());

        myRequest.setOpt(new HttpHeader(header));
        myRequest.setOpt(new CustomRequest("PUT"));
        myRequest.setOpt(new PostFields(body));
        myRequest.setOpt(new PostFieldSize(body.size()));

        ostringstream os;
        os << myRequest;
        todos = json::parse(os.str());
        ofstream o(config["jsonFile"].get<string>());
        o << todos.dump(4);
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
}
