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

string login(string email, string pw, json config)
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

json syncTodos(json deleted, json config, json todos)
{
    try
    {
        curlpp::Cleanup myCleanup;

        for(json del : deleted) {
            std::stringstream deleteUrl;
            deleteUrl << config["baseUrl"].get<string>() << "/api/v1/todo/" << del.get<string>();

            curlpp::Easy deleteReq;
            deleteReq.setOpt<Url>(deleteUrl.str());
            std::list<std::string> header;
            header.push_back("Content-Type: application/json");
            std::stringstream auth;
            auth << "x-auth-token: " << config["token"].get<string>();
            header.push_back(auth.str());

            deleteReq.setOpt(new HttpHeader(header));
            deleteReq.setOpt(new CustomRequest("DELETE"));

            ostringstream os;
            os << deleteReq;
        }

        string body = todos.dump();

        std::stringstream ss;
        ss << config["baseUrl"].get<string>() << "/api/v1/todo";

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
        return todos;
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