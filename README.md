### Overview

`kindle-my-clippings` is a command line tool for parsing and organizing your Kindle highlights.

### Getting started

If you installed the module globally, run it in the folder containing 'My Clippings.txt' file or specify a path
to it with -i (--input) option.

Running `kindle-my-clippings` will display a title list, ex.:

```
1 - Developing Backbone.js Applications
2 - Dive Into Python
3 - Zen and the Art of Motorcycle Maintenance
4 - Jump Start Node.js
```

Entering a number from the list will display all highlights for a corresponding title.

### Options

#### `-l, --location`

will show location of each highlight, ex.

```
----------	205-6

We’re in such a hurry most of the time we never get much chance to talk.
The result is a kind of endless day-to-day shallowness, a monotony that leaves a person wondering years later where all the time went and sorry that it’s all gone.

----------	207-8

What is in mind is a sort of Chautauqua—that’s the only name I can think of for it—like the traveling tent-show Chautauquas that used to move across America,

----------	211-12

Perhaps because of these changes the stream of national consciousness moves faster now, and is broader, but it seems to run less deep.

----------	213-14

In this Chautauqua I would like not to cut any new channels of consciousness but simply dig deeper into old ones that have become silted in with the debris of thoughts grown stale and platitudes too often repeated.
```

You might want to use locations for more controll over the output - see the next option.

#### `-s, --start <location>`

This options lets you specify the first highlight to display from. For example, given the above example output,
running `kindle-my-clippings -b 3 -l -s '211-12'` will return highlights starting from this particular location, skipping the first two.

This may be useful in a situation where you've generated a file with some highlights but want to add more to the same file after fihishing the book.

__Note__ the use of `-b` option which is mandatory to use with `-s` options.

#### `-b, --book <number>`

Specifying this option will skip the title list and at the beginning and display the contents of a given book.

#### `-i, --input <path to a file/files>`

Lets you specify a path to your clippings file or files. You can specify multiple coma separated files, ex. `-i 'my_clippings_1.txt,my_clippings_2.txt'`.

#### `-o, --output <path to a file>`

Writes output to the provided path.

#### `-f, --format <json|text>`

Determines the output of clippings: `json` for a stringified collection of JSON objects, `text` for plain text.
If the option is not specified, the default format is `text`.

### Changelog

For the older version of the module, which provides using it directly in the code as well as `html` as the output format go
to the [version 0.2.1](https://github.com/baniol/kindle-my-clippings/tree/0.2.1).

