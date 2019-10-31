# err.codes

This microservice for _everyone_ forwards you to detailed error messages.

Example: https://err.codes/micro/path-missing

## URL structure

```text
https://err.codes/micro/path-missing
                  [___] [__________]
                    |        |
npm package name ---/        |
                             |
filename.md in `errors/` --- /
```
