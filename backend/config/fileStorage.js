const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// 数据存储目录
const DATA_DIR = path.join(__dirname, '../../data');

// 确保数据目录存在
const ensureDataDir = () => {
  const dirs = ['users', 'categories', 'files'];
  
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  dirs.forEach(dir => {
    const dirPath = path.join(DATA_DIR, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
};

// 初始化存储
const initStorage = () => {
  ensureDataDir();
  console.log('文件存储系统初始化成功');
};

// 通用CRUD操作
class FileStorage {
  constructor(entityType) {
    this.entityType = entityType;
    this.dataPath = path.join(DATA_DIR, entityType);
    ensureDataDir();
  }

  // 获取所有实体
  async findAll() {
    try {
      const files = fs.readdirSync(this.dataPath);
      return Promise.all(
        files
          .filter(file => file.endsWith('.json'))
          .map(file => {
            const data = fs.readFileSync(path.join(this.dataPath, file), 'utf8');
            return JSON.parse(data);
          })
      );
    } catch (error) {
      console.error(`Error reading ${this.entityType}:`, error);
      return [];
    }
  }

  // 根据ID查找实体
  async findByPk(id) {
    try {
      const filePath = path.join(this.dataPath, `${id}.json`);
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      console.error(`Error finding ${this.entityType} by id:`, error);
      return null;
    }
  }

  // 根据条件查找实体
  async findOne(where) {
    try {
      const entities = await this.findAll();
      return entities.find(entity => {
        return Object.keys(where).every(key => entity[key] === where[key]);
      });
    } catch (error) {
      console.error(`Error finding ${this.entityType}:`, error);
      return null;
    }
  }

  // 创建实体
  async create(data) {
    try {
      const id = data.id || uuidv4();
      const timestamp = new Date();
      const newEntity = {
        ...data,
        id,
        createdAt: data.createdAt || timestamp,
        updatedAt: timestamp
      };
      
      fs.writeFileSync(
        path.join(this.dataPath, `${id}.json`),
        JSON.stringify(newEntity, null, 2)
      );
      
      return newEntity;
    } catch (error) {
      console.error(`Error creating ${this.entityType}:`, error);
      throw error;
    }
  }

  // 更新实体
  async update(data, where) {
    try {
      if (where.id) {
        const id = where.id;
        const filePath = path.join(this.dataPath, `${id}.json`);
        
        if (fs.existsSync(filePath)) {
          const existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          const updatedData = {
            ...existingData,
            ...data,
            updatedAt: new Date()
          };
          
          fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
          return [1, [updatedData]]; // 模拟Sequelize返回格式 [affectedCount, affectedRows]
        }
      } else {
        // 如果没有指定ID，则更新所有匹配条件的实体
        const entities = await this.findAll();
        const updatedEntities = [];
        
        entities.forEach(entity => {
          const matches = Object.keys(where).every(key => entity[key] === where[key]);
          
          if (matches) {
            const updatedEntity = {
              ...entity,
              ...data,
              updatedAt: new Date()
            };
            
            fs.writeFileSync(
              path.join(this.dataPath, `${entity.id}.json`),
              JSON.stringify(updatedEntity, null, 2)
            );
            
            updatedEntities.push(updatedEntity);
          }
        });
        
        return [updatedEntities.length, updatedEntities];
      }
      
      return [0, []]; // 没有更新任何记录
    } catch (error) {
      console.error(`Error updating ${this.entityType}:`, error);
      throw error;
    }
  }

  // 删除实体
  async destroy(where) {
    try {
      if (where.id) {
        const id = where.id;
        const filePath = path.join(this.dataPath, `${id}.json`);
        
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          return 1; // 删除成功，返回影响的行数
        }
      } else {
        // 如果没有指定ID，则删除所有匹配条件的实体
        const entities = await this.findAll();
        let deletedCount = 0;
        
        entities.forEach(entity => {
          const matches = Object.keys(where).every(key => entity[key] === where[key]);
          
          if (matches) {
            fs.unlinkSync(path.join(this.dataPath, `${entity.id}.json`));
            deletedCount++;
          }
        });
        
        return deletedCount;
      }
      
      return 0; // 没有删除任何记录
    } catch (error) {
      console.error(`Error deleting ${this.entityType}:`, error);
      throw error;
    }
  }
}

module.exports = {
  initStorage,
  FileStorage
};