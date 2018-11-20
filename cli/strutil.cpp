#include <string>
#include <stdlib.h>
#include <sstream>

using namespace std;

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

string printPretty(string message, int options[], int oL)
{
    stringstream ss;
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

string currentTime()
{
    auto now = chrono::system_clock::now();
    auto in_time_t = chrono::system_clock::to_time_t(now);

    std::stringstream ss;
    ss << put_time(localtime(&in_time_t), "%Y-%m-%d %X");
    return ss.str();
}