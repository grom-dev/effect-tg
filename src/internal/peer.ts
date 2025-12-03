import * as Schema from 'effect/Schema'

export const Username = <S extends Schema.Schema.Any>(
  annotations?: Schema.Annotations.Filter<Schema.Schema.Type<S>>,
) =>
  <A extends string>(self: S & Schema.Schema<A, Schema.Schema.Encoded<S>, Schema.Schema.Context<S>>): Schema.filter<S> =>
    self.pipe(
      Schema.filter(
        (a) => {
          if (a.length < 4) {
            return 'too short'
          }
          if (a.length > 32) {
            return 'too long'
          }
          if (!a.match(/^\w+$/)) {
            return 'can only contain letters, digits, and underscore'
          }
          if (a.startsWith('_')) {
            return 'cannot start with an underscore'
          }
          if (a.match(/^\d/)) {
            return 'cannot start with a digit'
          }
          if (a.endsWith('_')) {
            return 'cannot end with an underscore'
          }
          if (a.includes('__')) {
            return 'cannot contain consecutive underscores'
          }
          return true
        },
        {
          title: 'Telegram username',
          ...annotations,
        },
      ),
    )
