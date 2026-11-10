// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'weather_reading.dart';

// **************************************************************************
// IsarCollectionGenerator
// **************************************************************************

// coverage:ignore-file
// ignore_for_file: duplicate_ignore, non_constant_identifier_names, constant_identifier_names, invalid_use_of_protected_member, unnecessary_cast, prefer_const_constructors, lines_longer_than_80_chars, require_trailing_commas, inference_failure_on_function_invocation, unnecessary_parenthesis, unnecessary_raw_strings, unnecessary_null_checks, join_return_with_assignment, prefer_final_locals, avoid_js_rounded_ints, avoid_positional_boolean_parameters, always_specify_types, experimental_member_use

extension GetWeatherReadingCollection on Isar {
  IsarCollection<WeatherReading> get weatherReadings => this.collection();
}

const WeatherReadingSchema = CollectionSchema(
  name: r'WeatherReading',
  id: 2536027376881045642,
  properties: {
    r'humidity': PropertySchema(id: 0, name: r'humidity', type: IsarType.long),
    r'measuredAt': PropertySchema(
      id: 1,
      name: r'measuredAt',
      type: IsarType.dateTime,
    ),
    r'temperature': PropertySchema(
      id: 2,
      name: r'temperature',
      type: IsarType.double,
    ),
    r'wind': PropertySchema(id: 3, name: r'wind', type: IsarType.double),
  },

  estimateSize: _weatherReadingEstimateSize,
  serialize: _weatherReadingSerialize,
  deserialize: _weatherReadingDeserialize,
  deserializeProp: _weatherReadingDeserializeProp,
  idName: r'id',
  indexes: {},
  links: {},
  embeddedSchemas: {},

  getId: _weatherReadingGetId,
  getLinks: _weatherReadingGetLinks,
  attach: _weatherReadingAttach,
  version: '3.4.1',
);

int _weatherReadingEstimateSize(
  WeatherReading object,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  var bytesCount = offsets.last;
  return bytesCount;
}

void _weatherReadingSerialize(
  WeatherReading object,
  IsarWriter writer,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  writer.writeLong(offsets[0], object.humidity);
  writer.writeDateTime(offsets[1], object.measuredAt);
  writer.writeDouble(offsets[2], object.temperature);
  writer.writeDouble(offsets[3], object.wind);
}

WeatherReading _weatherReadingDeserialize(
  Id id,
  IsarReader reader,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  final object = WeatherReading();
  object.humidity = reader.readLong(offsets[0]);
  object.id = id;
  object.measuredAt = reader.readDateTime(offsets[1]);
  object.temperature = reader.readDouble(offsets[2]);
  object.wind = reader.readDouble(offsets[3]);
  return object;
}

P _weatherReadingDeserializeProp<P>(
  IsarReader reader,
  int propertyId,
  int offset,
  Map<Type, List<int>> allOffsets,
) {
  switch (propertyId) {
    case 0:
      return (reader.readLong(offset)) as P;
    case 1:
      return (reader.readDateTime(offset)) as P;
    case 2:
      return (reader.readDouble(offset)) as P;
    case 3:
      return (reader.readDouble(offset)) as P;
    default:
      throw IsarError('Unknown property with id $propertyId');
  }
}

Id _weatherReadingGetId(WeatherReading object) {
  return object.id;
}

List<IsarLinkBase<dynamic>> _weatherReadingGetLinks(WeatherReading object) {
  return [];
}

void _weatherReadingAttach(
  IsarCollection<dynamic> col,
  Id id,
  WeatherReading object,
) {
  object.id = id;
}

extension WeatherReadingQueryWhereSort
    on QueryBuilder<WeatherReading, WeatherReading, QWhere> {
  QueryBuilder<WeatherReading, WeatherReading, QAfterWhere> anyId() {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(const IdWhereClause.any());
    });
  }
}

extension WeatherReadingQueryWhere
    on QueryBuilder<WeatherReading, WeatherReading, QWhereClause> {
  QueryBuilder<WeatherReading, WeatherReading, QAfterWhereClause> idEqualTo(
    Id id,
  ) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(IdWhereClause.between(lower: id, upper: id));
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterWhereClause> idNotEqualTo(
    Id id,
  ) {
    return QueryBuilder.apply(this, (query) {
      if (query.whereSort == Sort.asc) {
        return query
            .addWhereClause(
              IdWhereClause.lessThan(upper: id, includeUpper: false),
            )
            .addWhereClause(
              IdWhereClause.greaterThan(lower: id, includeLower: false),
            );
      } else {
        return query
            .addWhereClause(
              IdWhereClause.greaterThan(lower: id, includeLower: false),
            )
            .addWhereClause(
              IdWhereClause.lessThan(upper: id, includeUpper: false),
            );
      }
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterWhereClause> idGreaterThan(
    Id id, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(
        IdWhereClause.greaterThan(lower: id, includeLower: include),
      );
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterWhereClause> idLessThan(
    Id id, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(
        IdWhereClause.lessThan(upper: id, includeUpper: include),
      );
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterWhereClause> idBetween(
    Id lowerId,
    Id upperId, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(
        IdWhereClause.between(
          lower: lowerId,
          includeLower: includeLower,
          upper: upperId,
          includeUpper: includeUpper,
        ),
      );
    });
  }
}

extension WeatherReadingQueryFilter
    on QueryBuilder<WeatherReading, WeatherReading, QFilterCondition> {
  QueryBuilder<WeatherReading, WeatherReading, QAfterFilterCondition>
  humidityEqualTo(int value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.equalTo(property: r'humidity', value: value),
      );
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterFilterCondition>
  humidityGreaterThan(int value, {bool include = false}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.greaterThan(
          include: include,
          property: r'humidity',
          value: value,
        ),
      );
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterFilterCondition>
  humidityLessThan(int value, {bool include = false}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.lessThan(
          include: include,
          property: r'humidity',
          value: value,
        ),
      );
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterFilterCondition>
  humidityBetween(
    int lower,
    int upper, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.between(
          property: r'humidity',
          lower: lower,
          includeLower: includeLower,
          upper: upper,
          includeUpper: includeUpper,
        ),
      );
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterFilterCondition> idEqualTo(
    Id value,
  ) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.equalTo(property: r'id', value: value),
      );
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterFilterCondition>
  idGreaterThan(Id value, {bool include = false}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.greaterThan(
          include: include,
          property: r'id',
          value: value,
        ),
      );
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterFilterCondition>
  idLessThan(Id value, {bool include = false}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.lessThan(
          include: include,
          property: r'id',
          value: value,
        ),
      );
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterFilterCondition> idBetween(
    Id lower,
    Id upper, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.between(
          property: r'id',
          lower: lower,
          includeLower: includeLower,
          upper: upper,
          includeUpper: includeUpper,
        ),
      );
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterFilterCondition>
  measuredAtEqualTo(DateTime value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.equalTo(property: r'measuredAt', value: value),
      );
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterFilterCondition>
  measuredAtGreaterThan(DateTime value, {bool include = false}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.greaterThan(
          include: include,
          property: r'measuredAt',
          value: value,
        ),
      );
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterFilterCondition>
  measuredAtLessThan(DateTime value, {bool include = false}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.lessThan(
          include: include,
          property: r'measuredAt',
          value: value,
        ),
      );
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterFilterCondition>
  measuredAtBetween(
    DateTime lower,
    DateTime upper, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.between(
          property: r'measuredAt',
          lower: lower,
          includeLower: includeLower,
          upper: upper,
          includeUpper: includeUpper,
        ),
      );
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterFilterCondition>
  temperatureEqualTo(double value, {double epsilon = Query.epsilon}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.equalTo(
          property: r'temperature',
          value: value,

          epsilon: epsilon,
        ),
      );
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterFilterCondition>
  temperatureGreaterThan(
    double value, {
    bool include = false,
    double epsilon = Query.epsilon,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.greaterThan(
          include: include,
          property: r'temperature',
          value: value,

          epsilon: epsilon,
        ),
      );
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterFilterCondition>
  temperatureLessThan(
    double value, {
    bool include = false,
    double epsilon = Query.epsilon,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.lessThan(
          include: include,
          property: r'temperature',
          value: value,

          epsilon: epsilon,
        ),
      );
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterFilterCondition>
  temperatureBetween(
    double lower,
    double upper, {
    bool includeLower = true,
    bool includeUpper = true,
    double epsilon = Query.epsilon,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.between(
          property: r'temperature',
          lower: lower,
          includeLower: includeLower,
          upper: upper,
          includeUpper: includeUpper,

          epsilon: epsilon,
        ),
      );
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterFilterCondition>
  windEqualTo(double value, {double epsilon = Query.epsilon}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.equalTo(
          property: r'wind',
          value: value,

          epsilon: epsilon,
        ),
      );
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterFilterCondition>
  windGreaterThan(
    double value, {
    bool include = false,
    double epsilon = Query.epsilon,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.greaterThan(
          include: include,
          property: r'wind',
          value: value,

          epsilon: epsilon,
        ),
      );
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterFilterCondition>
  windLessThan(
    double value, {
    bool include = false,
    double epsilon = Query.epsilon,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.lessThan(
          include: include,
          property: r'wind',
          value: value,

          epsilon: epsilon,
        ),
      );
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterFilterCondition>
  windBetween(
    double lower,
    double upper, {
    bool includeLower = true,
    bool includeUpper = true,
    double epsilon = Query.epsilon,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.between(
          property: r'wind',
          lower: lower,
          includeLower: includeLower,
          upper: upper,
          includeUpper: includeUpper,

          epsilon: epsilon,
        ),
      );
    });
  }
}

extension WeatherReadingQueryObject
    on QueryBuilder<WeatherReading, WeatherReading, QFilterCondition> {}

extension WeatherReadingQueryLinks
    on QueryBuilder<WeatherReading, WeatherReading, QFilterCondition> {}

extension WeatherReadingQuerySortBy
    on QueryBuilder<WeatherReading, WeatherReading, QSortBy> {
  QueryBuilder<WeatherReading, WeatherReading, QAfterSortBy> sortByHumidity() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'humidity', Sort.asc);
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterSortBy>
  sortByHumidityDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'humidity', Sort.desc);
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterSortBy>
  sortByMeasuredAt() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'measuredAt', Sort.asc);
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterSortBy>
  sortByMeasuredAtDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'measuredAt', Sort.desc);
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterSortBy>
  sortByTemperature() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'temperature', Sort.asc);
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterSortBy>
  sortByTemperatureDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'temperature', Sort.desc);
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterSortBy> sortByWind() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'wind', Sort.asc);
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterSortBy> sortByWindDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'wind', Sort.desc);
    });
  }
}

extension WeatherReadingQuerySortThenBy
    on QueryBuilder<WeatherReading, WeatherReading, QSortThenBy> {
  QueryBuilder<WeatherReading, WeatherReading, QAfterSortBy> thenByHumidity() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'humidity', Sort.asc);
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterSortBy>
  thenByHumidityDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'humidity', Sort.desc);
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterSortBy> thenById() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'id', Sort.asc);
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterSortBy> thenByIdDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'id', Sort.desc);
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterSortBy>
  thenByMeasuredAt() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'measuredAt', Sort.asc);
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterSortBy>
  thenByMeasuredAtDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'measuredAt', Sort.desc);
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterSortBy>
  thenByTemperature() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'temperature', Sort.asc);
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterSortBy>
  thenByTemperatureDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'temperature', Sort.desc);
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterSortBy> thenByWind() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'wind', Sort.asc);
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QAfterSortBy> thenByWindDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'wind', Sort.desc);
    });
  }
}

extension WeatherReadingQueryWhereDistinct
    on QueryBuilder<WeatherReading, WeatherReading, QDistinct> {
  QueryBuilder<WeatherReading, WeatherReading, QDistinct> distinctByHumidity() {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'humidity');
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QDistinct>
  distinctByMeasuredAt() {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'measuredAt');
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QDistinct>
  distinctByTemperature() {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'temperature');
    });
  }

  QueryBuilder<WeatherReading, WeatherReading, QDistinct> distinctByWind() {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'wind');
    });
  }
}

extension WeatherReadingQueryProperty
    on QueryBuilder<WeatherReading, WeatherReading, QQueryProperty> {
  QueryBuilder<WeatherReading, int, QQueryOperations> idProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'id');
    });
  }

  QueryBuilder<WeatherReading, int, QQueryOperations> humidityProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'humidity');
    });
  }

  QueryBuilder<WeatherReading, DateTime, QQueryOperations>
  measuredAtProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'measuredAt');
    });
  }

  QueryBuilder<WeatherReading, double, QQueryOperations> temperatureProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'temperature');
    });
  }

  QueryBuilder<WeatherReading, double, QQueryOperations> windProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'wind');
    });
  }
}
