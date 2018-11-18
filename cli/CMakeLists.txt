cmake_minimum_required(VERSION 3.8)

set (CMAKE_CXX_STANDARD 11)

add_subdirectory(json)
add_subdirectory(curlpp)

set(BOOST_ROOT /home/hoff/Documents/Programming/C++/libs/boost_1_67_0/)
find_package (Boost 1.55.0 REQUIRED COMPONENTS program_options)
INCLUDE_DIRECTORIES( ${Boost_INCLUDE_DIR} )


add_executable(hallowelt main.cpp)

target_link_libraries(hallowelt uuid nlohmann_json::nlohmann_json curlpp ${Boost_LIBRARIES})