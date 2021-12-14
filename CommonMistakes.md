# Common Mistakes

## NoteService

### Don't use try/catch block when waiting for data to load

The below code won't work

```
 try {
          this.notes = JSON.parse(data);
          console.log(resolve(this.notes));
        } catch (err) {
          return reject(err);
        }
        // If it's outside the try/catch, won't return the actual data
        // because the value hasn't been given back from the callback
        // try/block hasn't finished data binding notes to this.notes
        return resolve(this.notes);
      }
```
