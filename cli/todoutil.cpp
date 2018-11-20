#include <iostream>
#include <ctime>
#include <uuid/uuid.h>
#include <string>
#include <stdlib.h>
#include <list>
#include <nlohmann/json.hpp>
#include <iostream>
#include <fstream>
#include <sstream>
#include <regex>
#include <chrono>
#include <ctime>
#include <iomanip>
#include <algorithm> 
#include <cctype>
#include <locale>

#include "strutil.cpp"

using json = nlohmann::json;
using namespace std;

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